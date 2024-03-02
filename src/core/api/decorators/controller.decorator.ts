import { MetaRoute } from "../../common/meta-route.container";
import { CONTROLLER_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function Controller(path: string) {
  return function (target: Function) {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, path, target);
    MetaRoute.register(target as new (...args: any[]) => any);
  };
}
