import { HttpMethod } from "../../enums/http.method";
import { Injectable } from "../../../common/decorators/injectable.decorator";
import { ConsoleLogger } from "../../../common/services/console-logger.service";
import { MiddlewareHandler } from "../middleware-handler.core";
import { RouteRegistry } from "./route-registry.core";
import { HttpStatus } from "../../enums/http.status";
import { MetaRouteRequest } from "../interfaces/meta-route.request";
import { MetaRouteResponse } from "../interfaces/meta-route.response";
import { getClientIp } from "../../functions/get-client-ip.function";
import { Scope } from "../../../common/enums/scope.enum";
import { Route, UnifiedMiddleware } from "../../types";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteRouter {
  constructor(
    private readonly _routeRegistry: RouteRegistry,
    private readonly _middlewareHandler: MiddlewareHandler,
    private readonly logger: ConsoleLogger
  ) {
    this.logger.setContext(MetaRouteRouter.name);
  }

  registerMiddleware(middleware: UnifiedMiddleware) {
    this._middlewareHandler.use(middleware);
  }

  private nextGlobal(
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    route?: Route
  ) {
    this._middlewareHandler.handle(
      this._middlewareHandler.middleware,
      req,
      res,
      async (err?: Error) => {
        if (route === undefined) {
          this.logger.debug(`Resource not found on path: ${req.url}`);
          res.status(HttpStatus.NOT_FOUND).send({
            status: HttpStatus.NOT_FOUND,
            message: "Resource not found",
          });
          return;
        }

        this.nextRoute(req, res, route);
      }
    );
  }

  private nextRoute(
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    route: Route
  ) {
    this._middlewareHandler.handle(
      route.middleware || [],
      req,
      res,
      async () => {
        route.handler(req, res, async (err?: Error) => {
          const errorMiddleware = this._middlewareHandler.middleware.filter(
            (m) => m.length === 4
          );
          this._middlewareHandler.handle(
            errorMiddleware as UnifiedMiddleware[],
            req,
            res,
            async (err?: Error) => {
              res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(err ? err.message : "Internal Server Error");
            },
            err
          );
        });
      }
    );
  }

  handleRequest(req: MetaRouteRequest, res: MetaRouteResponse) {
    const method = req.method?.toLowerCase() as HttpMethod;

    const { route, pathParams, queryParams } = this._routeRegistry.getRoute(
      method,
      req.url || "",
      req.headers.host ?? ""
    );

    this.logger.debug(
      `Handling request: ${req.method} ${req.url}, route: ${route}`
    );

    req.params = pathParams;
    req.query = queryParams;
    req.ip = getClientIp(req);

    this.nextGlobal(req, res, route);
  }

  get routeRegistry(): RouteRegistry {
    return this._routeRegistry;
  }
}
