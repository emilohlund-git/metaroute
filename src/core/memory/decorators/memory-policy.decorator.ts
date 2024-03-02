import { MEMORY_POLICY_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { MetaRoute } from "../../common/meta-route.container";

export function MemoryPolicy(target: any) {
  Reflect.defineMetadata(MEMORY_POLICY_METADATA_KEY, true, target);
  MetaRoute.register(target);
}
