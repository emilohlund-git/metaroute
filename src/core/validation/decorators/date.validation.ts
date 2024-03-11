import { VALIDATION_METADATA_KEY } from "../../common/constants";
import { MetaRouteValidators } from "../constants/metaroute-validator.constant";

export function IsDate(defaultError?: string): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, target) || [];
    metadata.push({
      key: propertyKey,
      validate: MetaRouteValidators.date.validate,
      defaultError: defaultError ?? "Value must be a date.",
    });
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, metadata, target);
  };
}
