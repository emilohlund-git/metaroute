import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { MetaRouteValidators } from "../constants/metaroute-validator.constant";

export function IsPattern(
  pattern: RegExp,
  defaultError?: string
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, target) || [];
    metadata.push({
      key: propertyKey,
      validate: (value: string) =>
        MetaRouteValidators.pattern.validate(value, pattern, defaultError),
      defaultError: defaultError ?? "Pattern is not valid.",
    });
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, metadata, target);
  };
}
