import { CONFIGURATOR_METADATA_KEY } from "../constants/metadata-keys.constants";
import { MetaRoute } from "../meta-route.container";

export function Configurator(target: new (...args: any[]) => any) {
  Reflect.defineMetadata(CONFIGURATOR_METADATA_KEY, {}, target);
  MetaRoute.register(target);
}
