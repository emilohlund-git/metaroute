import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { MetaRouteValidators } from "../constants/metaroute-validator.constant";

export function IsBoolean(defaultError?: string): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, target) || [];
    metadata.push({
      key: propertyKey,
      validate: MetaRouteValidators.boolean.validate,
      defaultError: defaultError ?? "Value must be a boolean.",
    });
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, metadata, target);
  };
}
