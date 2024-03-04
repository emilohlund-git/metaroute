import {
  CONTROLLER_METADATA_KEY,
  DATABASE_METADATA_KEY,
  SOCKETIO_SERVER_METADATA_KEY,
} from "./constants/metadata-keys.constants";
import { Configurator } from "./decorators/configurator.decorator";
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

@Configurator
export class ServerConfigurator implements Initializable {
  private readonly logger = new ConsoleLogger(ServerConfigurator.name);
  private io: SocketServer;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpRouter: ControllerHandler<any>,
    private readonly eventRouter: EventRouter<any>,
    private readonly server: MetaRouteServer
  ) {}

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
    const appPort = config.port
      ? config.port
      : parseInt(this.configService.get("PORT"));
    this.server.listen(appPort, config, () => {
      config.ssl
        ? this.logger.success(`[HTTPS] - 🚀 Server running on port ${appPort}`)
        : this.logger.success(`[HTTP] - 🚀 Server running on port ${appPort}`);
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
    const allowedOrigins = this.configService.get("ALLOWED_ORIGINS");
    if (allowedOrigins && typeof allowedOrigins === "string") {
      if (allowedOrigins.includes(",")) {
        return allowedOrigins.split(",");
      } else {
        return [allowedOrigins];
      }
    } else {
      return ["*"];
    }
  }
}
