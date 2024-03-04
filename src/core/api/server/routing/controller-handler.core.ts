import {
  BODY_METADATA_KEY,
  CACHE_METADATA_KEY,
  CONTROLLER_METADATA_KEY,
  HEADERS_METADATA_KEY,
  PARAM_METADATA_KEY,
  QUERY_METADATA_KEY,
  RATE_LIMITER_METADATA_KEY,
  REQ_METADATA_KEY,
  RES_METADATA_KEY,
  ROUTE_METADATA_KEY,
} from "../../../common/constants/metadata-keys.constants";
import { Router } from "./router.abstract";
import { ConsoleLogger } from "../../../common/services/console-logger.service";
import { RateLimiterOptions } from "../../../common/interfaces/rate-limiter.interface";
import { createRateLimiterMiddleware } from "../../middleware/functions/create-rate-limiter-middleware";
import { Configurator } from "../../../common/decorators/configurator.decorator";
import { HttpMethod } from "../../enums/http.method";
import { MetaRouteServer } from "../basic-http-server.core";
import { NextFunction, RequestHandler } from "../types";
import { MetaRouteRequest } from "../interfaces/meta-route.request";
import { MetaRouteResponse } from "../interfaces/meta-route.response";
import { CacheOptions } from "../../../cache/interfaces/cache-options.interface";
import { createCacheMiddleware } from "../../../cache/functions/create-cache-middleware";

@Configurator
export class ControllerHandler<T extends Function> extends Router<T> {
  private readonly logger = new ConsoleLogger(ControllerHandler.name);

  constructor() {
    super();
  }

  public register(server: MetaRouteServer, controller: T): void {
    const controllerPath = Reflect.getMetadata(
      CONTROLLER_METADATA_KEY,
      controller.constructor
    );

    this.logger.debug(`Registering controller ${controllerPath}`);
    this.getControllerMethods(controller, ROUTE_METADATA_KEY).forEach(
      ({ key, metadata }) => {
        this.logger.success(
          `Registering ${metadata.method.toUpperCase()} ${controllerPath}${
            metadata.path
          }`
        );
        const handler = this.createHandler(controller, key);

        const rateLimiterOptions: RateLimiterOptions = Reflect.getMetadata(
          RATE_LIMITER_METADATA_KEY,
          controller,
          key
        );

        const cacheOptions: CacheOptions = Reflect.getMetadata(
          CACHE_METADATA_KEY,
          controller,
          key
        );

        if (cacheOptions) {
          this.logger.debug(`Caching ${controllerPath}${metadata.path}`);
          const cacheMiddleware = createCacheMiddleware(cacheOptions, key);
          if (!metadata.middleware) {
            metadata.middleware = [];
          }
          metadata.middleware.push(cacheMiddleware);
        }

        if (rateLimiterOptions) {
          this.logger.debug(`Rate limiting ${controllerPath}${metadata.path}`);
          const rateLimiterMiddleware = createRateLimiterMiddleware(
            rateLimiterOptions,
            key
          );
          if (!metadata.middleware) {
            metadata.middleware = [];
          }
          metadata.middleware.push(rateLimiterMiddleware);
        }

        const path = controllerPath + metadata.path;

        try {
          const method = metadata.method as HttpMethod;
          server[method](path, handler, metadata.middleware?.filter(Boolean));
        } catch (error: any) {
          this.logger.error(
            `Failed to register ${metadata.method.toUpperCase()} ${path} to ${
              controller.constructor.name
            }.${key}: ${error}`
          );
        }
      }
    );
  }

  private createHandler(controller: T, key: string): RequestHandler {
    return async (
      req: MetaRouteRequest,
      res: MetaRouteResponse,
      next: NextFunction
    ) => {
      try {
        this.logger.debug(
          `Handling request for ${controller.constructor.name}.${key}`
        );
        const args = this.buildArgs(controller, key, req, res);
        const result = await controller[key as keyof Function].bind(controller)(
          ...args
        );
        res.status(result.status).send(result.body);
      } catch (error) {
        next(error);
      }
    };
  }

  private buildArgs(
    controller: T,
    key: string,
    req: MetaRouteRequest,
    res: MetaRouteResponse
  ): any[] {
    const args: any[] = [];
    this.addParamsToArgs(args, controller, key, req);
    this.addQueryToArgs(args, controller, key, req);
    this.addHeadersToArgs(args, controller, key, req);
    this.addBodyToArgs(args, controller, key, req);
    this.addReqResToArgs(args, controller, key, req, res);
    return args;
  }

  private addParamsToArgs(
    args: any[],
    controller: T,
    key: string,
    req: MetaRouteRequest
  ): void {
    const paramParameters: {
      [key: string]: {
        index: number;
        pipe?: new () => { transform: (value: any) => any };
      };
    } = this.getMetaData(PARAM_METADATA_KEY, controller, key);
    if (paramParameters === undefined) return;
    Object.entries(paramParameters).forEach(([key, paramData]) => {
      let value = key === "all" ? req.params : req.params[key];
      if (paramData.pipe) {
        const pipeInstance = new paramData.pipe();
        value = pipeInstance.transform(value);
      }
      args[paramData.index] = value;
    });
  }

  private addQueryToArgs(
    args: any[],
    controller: T,
    key: string,
    req: MetaRouteRequest
  ): void {
    const queryParameters: {
      [key: string]: {
        index: number;
        pipe?: new () => { transform: (value: any) => any };
      };
    } = this.getMetaData(QUERY_METADATA_KEY, controller, key);
    if (queryParameters === undefined) return;
    Object.entries(queryParameters).forEach(([key, paramData]) => {
      let value = key === "all" ? req.query : req.query[key];

      if (paramData.pipe) {
        const pipeInstance = new paramData.pipe();
        if (key === "all" && typeof value === "object" && value !== null) {
          value = Object.fromEntries(
            Object.entries(value).map(([k, v]) => [
              k,
              pipeInstance.transform(v),
            ])
          );
        } else if (value !== undefined) {
          value = pipeInstance.transform(value);
        }
      }

      args[paramData.index] = value;
    });
  }

  private addHeadersToArgs(
    args: any[],
    controller: T,
    key: string,
    req: MetaRouteRequest
  ): void {
    const headersParameters: { [key: string]: number } = this.getMetaData(
      HEADERS_METADATA_KEY,
      controller,
      key
    );
    if (headersParameters === undefined) return;
    Object.entries(headersParameters).forEach(([key, index]) => {
      args[index] = key === "all" ? req.headers : req.headers[key];
    });
  }

  private addBodyToArgs(
    args: any[],
    controller: T,
    key: string,
    req: MetaRouteRequest
  ): void {
    const bodyMetadata = this.getMetaData(BODY_METADATA_KEY, controller, key);

    if (bodyMetadata !== undefined) {
      const bodyClass = bodyMetadata.types[bodyMetadata.parameterIndex];
      if (bodyClass) {
        args[bodyMetadata.parameterIndex] = this.transformToClass(
          bodyClass,
          req.body
        );
      } else {
        args[bodyMetadata.parameterIndex] = req.body;
      }
    }
  }

  private addReqResToArgs(
    args: any[],
    controller: T,
    key: string,
    req: MetaRouteRequest,
    res: MetaRouteResponse
  ): void {
    const reqIndex: number = this.getMetaData(
      REQ_METADATA_KEY,
      controller,
      key
    );
    if (reqIndex !== undefined) {
      args[reqIndex] = req;
    } else {
      args.push(req);
    }
    const resIndex: number = this.getMetaData(
      RES_METADATA_KEY,
      controller,
      key
    );
    if (resIndex !== undefined) {
      args[resIndex] = res;
    } else {
      args.push(res);
    }
  }

  private getMetaData(metadataKey: Symbol, controller: T, key: string): any {
    return Reflect.getMetadata(metadataKey, controller, key);
  }

  private transformToClass(
    classContructor: new () => any,
    plainObject: any
  ): any {
    return Object.assign(new classContructor(), plainObject);
  }
}
