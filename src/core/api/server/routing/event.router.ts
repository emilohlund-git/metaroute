import { Socket, Server as SocketServer } from "socket.io";
import {
  ON_MESSAGE_METADATA_KEY,
  SOCKETIO_SERVER_METADATA_KEY,
} from "../../../common/constants/metadata-keys.constants";
import { Router } from "./router.abstract";
import { ConsoleLogger } from "../../../common/services/console-logger.service";
import { Configurator } from "../../../common/decorators/configurator.decorator";

@Configurator
export class EventRouter<T extends Function> extends Router<T> {
  private readonly logger = new ConsoleLogger(EventRouter.name);

  constructor() {
    super();
  }

  public register(io: SocketServer, controller: T): void {
    const namespacePath = Reflect.getMetadata(
      SOCKETIO_SERVER_METADATA_KEY,
      controller.constructor
    );

    const namespace = io.of(namespacePath);

    this.getControllerMethods(controller, ON_MESSAGE_METADATA_KEY).forEach(
      ({ key, metadata }) => {
        this.logger.success(
          `Listening to event [${metadata}] on namespace [${namespacePath}]`
        );

        namespace.on("connection", (socket: Socket) => {
          this.registerEvent(socket, metadata, controller, key, io);
        });
      }
    );
  }

  private registerEvent(
    socket: Socket,
    event: string,
    controller: T,
    key: string,
    io: SocketServer
  ): void {
    socket.on(event, async (data: any) => {
      const result = await controller[key as keyof Function].bind(controller)(
        data,
        socket,
        io
      );
      socket.emit(event, result);
    });
  }
}
