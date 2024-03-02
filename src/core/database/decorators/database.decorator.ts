import { MetaRoute } from "../../common/meta-route.container";
import { DATABASE_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function Database(target: new (...args: any[]) => any) {
  Reflect.defineMetadata(DATABASE_METADATA_KEY, {}, target);
  MetaRoute.register(target);
}
