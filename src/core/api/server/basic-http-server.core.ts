import * as http from "http";
import * as https from "https";
import { Injectable } from "../../common/decorators/injectable.decorator";
import { MetaRouteRouter } from "./routing/basic-http.router.core";
import { HttpMethod } from "../enums/http.method";
import { createMetaRouteRequest } from "./functions/create-meta-route-request.function";
import { createMetaRouteResponse } from "./functions/create-meta-route-response.function";
import { RequestHandler, UnifiedMiddleware } from "./types";
import { AppConfiguration } from "../../common/interfaces/app-configuration.interface";
import { Scope } from "../../common/enums/scope.enum";
import { MetaRouteSocketServer } from "../websocket/metaroute-socket-server.socket";
import internal from "stream";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteServer {
  private server: http.Server | https.Server;

  constructor(
    private readonly router: MetaRouteRouter,
    private readonly webSocketServer: MetaRouteSocketServer
  ) {}

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

    this.server.on("upgrade", (req, socket, head) => {
      this.handleUpgrade(req, socket, head);
    });

    this.server.listen(port, callback);
  }

  private handleUpgrade(
    req: http.IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ) {
    if (req.headers["upgrade"] !== "websocket") {
      socket.end("HTTP/1.1 400 Bad Request");
      return;
    }

    this.webSocketServer.connect(req, socket, head);
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
