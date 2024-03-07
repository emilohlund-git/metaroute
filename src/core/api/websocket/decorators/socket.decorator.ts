import { MetaRoute } from "../../../common/meta-route.container";
import {
  INJECTABLE_METADATA_KEY,
  METAROUTE_SOCKET_SERVER_METADATA_KEY,
} from "../../../common/constants/metadata-keys.constants";

export function SocketServer(namespace: string) {
  return function (target: any) {
    Reflect.defineMetadata(
      METAROUTE_SOCKET_SERVER_METADATA_KEY,
      namespace,
      target
    );
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, {}, target);
    MetaRoute.register(target as new (...args: any[]) => any);
  };
}
