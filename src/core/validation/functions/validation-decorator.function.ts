import { VALIDATION_METADATA_KEY } from "../..";
import { ValidationOptions } from "../interfaces/validation-options.interface";

export function ValidationDecorator(
  options: ValidationOptions
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    let properties = Reflect.getMetadata(VALIDATION_METADATA_KEY, target) || [];
    properties.push({
      key: propertyKey as string,
      validate: options.validate,
      defaultError: options.defaultError,
    });
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, properties, target);
  };
}
