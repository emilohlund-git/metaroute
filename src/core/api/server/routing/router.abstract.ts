import { ControllerMethod } from "../../../common/interfaces/controller-method.interface";
import { Server as SocketServer } from "socket.io";
import { MetaRouteServer } from "../basic-http-server.core";

export abstract class Router<T extends Function> {
  abstract register(app: MetaRouteServer | SocketServer, controller: T): void;

  protected getControllerMethods(
    controller: T,
    metadataKey: Symbol
  ): ControllerMethod<any>[] {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
      .map((key) => ({
        key,
        metadata: Reflect.getMetadata(
          metadataKey,
          controller[key as keyof Function]
        ),
      }))
      .filter(({ metadata }) => metadata);
  }
}
