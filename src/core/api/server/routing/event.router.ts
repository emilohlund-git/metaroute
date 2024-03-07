import {
  METAROUTE_SOCKET_SERVER_METADATA_KEY,
  ON_MESSAGE_METADATA_KEY,
} from "../../../common/constants/metadata-keys.constants";
import { Router } from "./router.abstract";
import { ConsoleLogger } from "../../../common/services/console-logger.service";
import { Injectable } from "../../../common/decorators/injectable.decorator";
import { Scope } from "../../../common/enums/scope.enum";
import { MetaRouteSocketServer } from "../metaroute-socket.core";
import { MetaRouteSocket } from "../interfaces/meta-route.socket";

@Injectable({ scope: Scope.SINGLETON })
export class EventRouter<T extends Function> extends Router<T> {
  constructor(private readonly logger: ConsoleLogger) {
    super();

    this.logger.setContext(EventRouter.name);
  }

  public register(server: MetaRouteSocketServer, controller: T): void {
    const namespacePath = Reflect.getMetadata(
      METAROUTE_SOCKET_SERVER_METADATA_KEY,
      controller.constructor
    );

    const namespace = server.of(namespacePath);

    this.getControllerMethods(controller, ON_MESSAGE_METADATA_KEY).forEach(
      ({ key, metadata }) => {
        this.logger.success(
          `Listening to event [${metadata}] on namespace [${namespacePath}]`
        );

        namespace.on("connection", (socket: MetaRouteSocket) => {
          this.logger.success(
            `[🔌 ${socket.id}]: Joined namespace: [${namespacePath}]`
          );
          this.registerEvent(socket, metadata, controller, key, server);
        });

        namespace.on("disconnect", (socket: MetaRouteSocket) => {
          this.logger.success(
            `[🔌 ${socket.id}]: Left namespace: [${namespacePath}]`
          );
        });
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
    socket.on(event, async (data: any) => {
      const result = await controller[key as keyof Function].bind(controller)(
        data,
        socket,
        io
      );
      socket.emit(result.event, result.data);
    });
  }
}
