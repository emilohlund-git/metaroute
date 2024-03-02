import { MetaRoute } from "../../common/meta-route.container";
import { SOCKETIO_SERVER_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function SocketServer(namespace: string) {
  return function (target: any) {
    Reflect.defineMetadata(SOCKETIO_SERVER_METADATA_KEY, namespace, target);
    MetaRoute.register(target as new (...args: any[]) => any);
  };
}
