import { VALIDATION_METADATA_KEY } from "../../common/constants";
import { MetaRouteValidators } from "../constants/metaroute-validator.constant";

export function IsEnum(
  enumType: object,
  defaultError?: string
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const enumValues = Object.values(enumType);
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, target) || [];

    metadata.push({
      key: propertyKey,
      validate: (value: any) =>
        MetaRouteValidators.enum.validate(value, enumValues, defaultError),
      defaultError,
    });

    Reflect.defineMetadata(VALIDATION_METADATA_KEY, metadata, target);
  };
}
