import { ENTITY_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { MetaRoute } from "../../common/meta-route.container";

export function DatabaseEntity(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(
      ENTITY_METADATA_KEY,
      {
        tableName: target.name.toUpperCase(),
      },
      target
    );
    MetaRoute.register(target as new (...args: any[]) => any);
  };
}
