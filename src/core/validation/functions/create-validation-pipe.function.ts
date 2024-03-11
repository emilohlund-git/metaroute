import { ValidationException } from "../exceptions";
import { ValidationPipe } from "../pipes/validation-pipe.abstract";

export function createValidationPipe(
  validate: (value: any) => boolean,
  defaultError?: string
): new () => ValidationPipe {
  return class extends ValidationPipe {
    transform(value: any): any {
      if (!validate(value)) {
        throw new ValidationException(defaultError ?? "Validation failed");
      }
      return value;
    }
  };
}
