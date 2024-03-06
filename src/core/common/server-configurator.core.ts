import "reflect-metadata";

import {
  CONTROLLER_METADATA_KEY,
  DATABASE_METADATA_KEY,
  SOCKETIO_SERVER_METADATA_KEY,
} from "./constants/metadata-keys.constants";
import { MetaRoute } from "./meta-route.container";
import { EventRouter } from "../api/server/routing/event.router";
import { ControllerHandler } from "../api/server/routing/controller-handler.core";
import { Initializable } from "./interfaces/initializable.interface";
import { ConsoleLogger } from "./services/console-logger.service";
import { Server as SocketServer } from "socket.io";
import { ConfigService } from "./services/config.service";
import { MetaRouteServer } from "../api/server/basic-http-server.core";
import {
  ErrorMiddleware,
  Middleware,
  UnifiedMiddleware,
} from "../api/server/types";
import { AppConfiguration } from "./interfaces/app-configuration.interface";
import { Injectable } from "./decorators/injectable.decorator";
import { Scope } from "./enums/scope.enum";
import { HomeController } from "src/test";

@Injectable({ scope: Scope.CONFIGURATOR })
export class ServerConfigurator implements Initializable {
  private io: SocketServer;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpRouter: ControllerHandler<any>,
    private readonly eventRouter: EventRouter<any>,
    private readonly server: MetaRouteServer,
    private readonly logger: ConsoleLogger
  ) {
    this.logger.setContext(ServerConfigurator.name);
  }

  async setup(configuration: AppConfiguration): Promise<void> {
    this.startServer(configuration);
    this.initializeIO();
    this.registerMiddlewares(configuration.middleware);
    await this.registerRoutes();
    this.registerMiddlewares(configuration.errorMiddleware);
  }

  protected registerRoutes = async () => {
    this.registerStrategy(CONTROLLER_METADATA_KEY, (instance) =>
      this.httpRouter.register(this.server, instance)
    );
    this.registerStrategy(SOCKETIO_SERVER_METADATA_KEY, (instance) =>
      this.eventRouter.register(this.io, instance)
    );
    this.registerStrategy(DATABASE_METADATA_KEY, (instance) =>
      instance.connection.openConnection()
    );
  };

  protected registerStrategy = (
    metadataKey: Symbol,
    action: (instance: any) => void
  ) => {
    for (const instance of MetaRoute.getAllInstances()) {
      if (Reflect.hasMetadata(metadataKey, instance.constructor)) {
        action(instance);
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

  protected initializeIO: () => void = () => {
    this.io = new SocketServer(this.server.serverInstance, {
      cors: {
        origin: this.getAllowedOrigins(),
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["polling", "websocket"],
    });
  };

  private getAllowedOrigins() {
    let allowedOrigins;

    try {
      allowedOrigins = this.configService.get("ALLOWED_ORIGINS");
    } catch (error) {
      this.logger.warn(
        `No ALLOWED_ORIGINS environment variable found, using default value '*'`
      );
    }

    if (allowedOrigins && typeof allowedOrigins === "string") {
      if (allowedOrigins.includes(",")) {
        return allowedOrigins.split(",");
      } else {
        return allowedOrigins;
      }
    } else {
      return "*";
    }
  }
}
