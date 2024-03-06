import { MetaRoute } from "../../common/meta-route.container";
import {
  CONTROLLER_METADATA_KEY,
  INJECTABLE_METADATA_KEY,
} from "../../common/constants/metadata-keys.constants";
import { ServiceIdentifier } from "src/core/common";

export function Controller(path: string) {
  return function (target: Function) {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, path, target);
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, {}, target);
    MetaRoute.register(target as ServiceIdentifier<Function>);
  };
}
