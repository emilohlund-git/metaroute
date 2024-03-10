import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { ValidationOptions } from "../interfaces/validation-options.interface";
import { ValidationResult } from "../types";

function ValidationDecorator(options: ValidationOptions): PropertyDecorator {
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

export function createValidationDecorator(
  validate: (value: any) => ValidationResult,
  defaultError: string
): () => PropertyDecorator {
  return () => ValidationDecorator({ validate, defaultError });
}
