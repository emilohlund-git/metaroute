import { Router } from "../../server/routing/router.abstract";
import { ConsoleLogger } from "../../../common/services/console-logger.service";
import { Injectable } from "../../../common/decorators/injectable.decorator";
import { Scope } from "../../../common/enums/scope.enum";
import { MetaRouteSocketServer } from "../metaroute-socket-server.socket";
import { MetaRouteSocket } from "../interfaces/meta-route.socket";
import {
  METAROUTE_SOCKET_SERVER_METADATA_KEY,
  ON_CONNECT_METADATA_KEY,
  ON_DISCONNECT_METADATA_KEY,
  ON_MESSAGE_METADATA_KEY,
} from "../../../common/constants";

@Injectable({ scope: Scope.SINGLETON })
export class EventRouter<T extends Function> extends Router<T> {
  constructor(private readonly logger: ConsoleLogger) {
    super();

    this.logger.setContext(EventRouter.name);
  }

  public async register(
    server: MetaRouteSocketServer,
    controller: T
  ): Promise<void> {
    const namespacePath = Reflect.getMetadata(
      METAROUTE_SOCKET_SERVER_METADATA_KEY,
      controller.constructor
    );

    const namespace = server.namespace(namespacePath);

    this.getControllerMethods(controller, ON_MESSAGE_METADATA_KEY).forEach(
      ({ key, route }) => {
        this.logger.success(
          `Listening to event [${route}] on namespace [${namespacePath}]`
        );

        namespace.on("connection", (socket: MetaRouteSocket) => {
          this.logger.success(
            `[🔌 ${socket.id}]: Joined namespace: [${namespacePath}]`
          );

          this.handleConnection(controller, socket);
          this.registerEvent(socket, route, controller, key, server);
        });

        namespace.on("disconnect", (socket: MetaRouteSocket) => {
          this.logger.success(
            `[🔌 ${socket.id}]: Left namespace: [${namespacePath}]`
          );

          this.handleDisconnect(controller, socket);
        });
      }
    );
  }

  private handleConnection(controller: T, socket: MetaRouteSocket) {
    this.getControllerMethods(controller, ON_CONNECT_METADATA_KEY).forEach(
      ({ key }) => {
        const onConnectMethod = Reflect.getMetadata(
          ON_CONNECT_METADATA_KEY,
          controller[key as keyof Function]
        );
        onConnectMethod?.bind(controller)(socket);
      }
    );
  }

  private handleDisconnect(controller: T, socket: MetaRouteSocket) {
    this.getControllerMethods(controller, ON_DISCONNECT_METADATA_KEY).forEach(
      ({ key }) => {
        const onDisconnectMethod = Reflect.getMetadata(
          ON_DISCONNECT_METADATA_KEY,
          controller[key as keyof Function]
        );
        onDisconnectMethod?.bind(controller)(socket);
      }
    );
  }

  private registerEvent(
    socket: MetaRouteSocket,
    event: string,
    controller: T,
    key: string,
    io: MetaRouteSocketServer
  ): void {
    socket.on(event, (data: any) => {
      const result = controller[key as keyof Function].bind(controller)(
        data,
        socket,
        io
      );
      result && socket.send(result);
    });
  }
}
