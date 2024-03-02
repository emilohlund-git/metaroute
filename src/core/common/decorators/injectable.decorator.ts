import { INJECTABLE_METADATA_KEY } from "../constants/metadata-keys.constants";
import { MetaRoute } from "../meta-route.container";

export function Injectable(target: new (...args: any[]) => any) {
  Reflect.defineMetadata(INJECTABLE_METADATA_KEY, {}, target);
  MetaRoute.register(target);
}
