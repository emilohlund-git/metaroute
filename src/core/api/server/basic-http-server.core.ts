import * as http from "http";
import * as https from "https";
import { Injectable } from "../../common/decorators/injectable.decorator";
import { MetaRouteRouter } from "./routing/basic-http.router.core";
import { HttpMethod } from "../enums/http.method";
import { createMetaRouteRequest } from "./functions/create-meta-route-request.function";
import { createMetaRouteResponse } from "./functions/create-meta-route-response.function";
import { RequestHandler, UnifiedMiddleware } from "./types";
import { AppConfiguration } from "../../common/interfaces/app-configuration.interface";

@Injectable
export class MetaRouteServer {
  private server: http.Server | https.Server;

  constructor(private readonly router: MetaRouteRouter) {}

  listen(port: number, config: AppConfiguration, callback: () => void) {
    const reqHandler = (
      req: http.IncomingMessage,
      res: http.ServerResponse
    ) => {
      const request = createMetaRouteRequest(req);
      const response = createMetaRouteResponse(res);

      if (config.engine) {
        response.engine(config.engine);
      }

      this.router.handleRequest(request, response);
    };
    this.server = this.createServer(config, reqHandler);
    this.server.listen(port, callback);
  }

  get(
    path: string,
    handler: RequestHandler,
    ...middleware: UnifiedMiddleware[]
  ) {
    this.router.routeRegistry.register(
      HttpMethod.GET,
      path,
      handler,
      middleware
    );
  }

  post(
    path: string,
    handler: RequestHandler,
    ...middleware: UnifiedMiddleware[]
  ) {
    this.router.routeRegistry.register(
      HttpMethod.POST,
      path,
      handler,
      middleware
    );
  }

  put(
    path: string,
    handler: RequestHandler,
    ...middleware: UnifiedMiddleware[]
  ) {
    this.router.routeRegistry.register(
      HttpMethod.PUT,
      path,
      handler,
      middleware
    );
  }

  patch(
    path: string,
    handler: RequestHandler,
    ...middleware: UnifiedMiddleware[]
  ) {
    this.router.routeRegistry.register(
      HttpMethod.PATCH,
      path,
      handler,
      middleware
    );
  }

  delete(
    path: string,
    handler: RequestHandler,
    ...middleware: UnifiedMiddleware[]
  ) {
    this.router.routeRegistry.register(
      HttpMethod.DELETE,
      path,
      handler,
      middleware
    );
  }

  options(
    path: string,
    handler: RequestHandler,
    ...middleware: UnifiedMiddleware[]
  ) {
    this.router.routeRegistry.register(
      HttpMethod.OPTIONS,
      path,
      handler,
      middleware
    );
  }

  use(middleware: UnifiedMiddleware) {
    this.router.registerMiddleware(middleware);
  }

  close() {
    this.server.close();
  }

  get serverInstance() {
    return this.server;
  }

  private createServer(
    config: AppConfiguration,
    reqHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ): http.Server | https.Server {
    return config.ssl
      ? https.createServer(
          { key: config.ssl.key, cert: config.ssl.cert },
          reqHandler
        )
      : http.createServer(reqHandler);
  }
}
