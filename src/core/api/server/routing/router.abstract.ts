import { ControllerMethod } from "../../../common/interfaces/controller-method.interface";
import { MetaRouteServer } from "../basic-http-server.core";
import { MetaRouteSocketServer } from "../metaroute-socket.core";

export abstract class Router<T extends Function> {
  abstract register(
    app: MetaRouteServer | MetaRouteSocketServer,
    controller: T
  ): void;

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
