import "reflect-metadata";

import {
  CONTROLLER_METADATA_KEY,
  DATABASE_METADATA_KEY,
  METAROUTE_SOCKET_SERVER_METADATA_KEY,
} from "./constants/metadata-keys.constants";
import { MetaRoute } from "./meta-route.container";
import { EventRouter } from "../api/websocket/routing/event.router";
import { ControllerHandler } from "../api/server/routing/controller-handler.core";
import { Initializable } from "./interfaces/initializable.interface";
import { ConsoleLogger } from "./services/console-logger.service";
import { ConfigService } from "./services/config.service";
import { MetaRouteServer } from "../api/server/basic-http-server.core";
import { AppConfiguration } from "./interfaces/app-configuration.interface";
import { Injectable } from "./decorators/injectable.decorator";
import { Scope } from "./enums/scope.enum";
import { MetaRouteSocketServer } from "../api/websocket/metaroute-socket-server.socket";
import { ErrorMiddleware, Middleware, UnifiedMiddleware } from "../api";

@Injectable({ scope: Scope.CONFIGURATOR })
export class ServerConfigurator implements Initializable {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpRouter: ControllerHandler<any>,
    private readonly eventRouter: EventRouter<any>,
    private readonly server: MetaRouteServer,
    private readonly io: MetaRouteSocketServer,
    private readonly logger: ConsoleLogger
  ) {
    this.logger.setContext(ServerConfigurator.name);
  }

  async setup(configuration: AppConfiguration): Promise<void> {
    this.startServer(configuration);
    this.registerMiddlewares(configuration.middleware);
    await this.registerRoutes();
    this.registerMiddlewares(configuration.errorMiddleware);
  }

  private registerRoutes = async () => {
    this.registerStrategy(CONTROLLER_METADATA_KEY, (instance) =>
      this.httpRouter.register(this.server, instance)
    );
    this.registerStrategy(METAROUTE_SOCKET_SERVER_METADATA_KEY, (instance) =>
      this.eventRouter.register(this.io, instance)
    );
    this.registerStrategy(DATABASE_METADATA_KEY, (instance) =>
      instance.connection.openConnection()
    );
  };

  private registerStrategy = async (
    metadataKey: Symbol,
    action: (instance: any) => Promise<void>
  ) => {
    for (const instance of MetaRoute.getAllInstances()) {
      if (Reflect.hasMetadata(metadataKey, instance.constructor)) {
        await action(instance);
      }
    }
  };

  protected startServer(config: AppConfiguration) {
    let port: number;
    try {
      port = this.configService.getInteger("PORT");
    } catch (error) {
      this.logger.warn(
        `No PORT environment variable found, using app configuration or default port 3000`
      );
      port = config.port ? config.port : 3000;
    }
    this.server.listen(port, config, () => {
      config.ssl
        ? this.logger.success(`[HTTPS] - 🚀 Server running on port ${port}`)
        : this.logger.success(`[HTTP] - 🚀 Server running on port ${port}`);
    });
  }

  protected registerMiddlewares: (
    middlewares?: (Middleware | ErrorMiddleware)[]
  ) => void = async (middlewares) => {
    middlewares?.forEach((middleware) => {
      this.server.use(middleware as UnifiedMiddleware);
    });
  };
}
