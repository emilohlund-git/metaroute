import { ValidationException } from "../exceptions/validation.exception";
import { ValidationPipe } from "../pipes/validation-pipe.abstract";

export function createValidationPipe(
  validate: (value: any) => boolean
): new () => ValidationPipe {
  return class extends ValidationPipe {
    transform(value: any): any {
      if (!validate(value)) {
        throw new ValidationException("Validation failed");
      }
      return value;
    }
  };
}
