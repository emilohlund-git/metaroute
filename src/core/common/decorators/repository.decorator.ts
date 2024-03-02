import { MetaRoute } from "../meta-route.container";
import { REPOSITORY_METADATA_KEY } from "../constants/metadata-keys.constants";

export function Repository(target: new (...args: any[]) => any) {
  Reflect.defineMetadata(REPOSITORY_METADATA_KEY, {}, target);
  MetaRoute.register(target);
}
