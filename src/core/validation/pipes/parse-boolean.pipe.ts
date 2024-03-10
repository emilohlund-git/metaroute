import { ValidationException } from "../exceptions/validation.exception";
import { ValidationPipe } from "./validation-pipe.abstract";

export class ParseBooleanPipe extends ValidationPipe {
  transform(value: any): boolean {
    const val = String(value).toLowerCase();
    if (val === "true" || val === "1") {
      return true;
    } else if (val === "false" || val === "0") {
      return false;
    } else {
      throw new ValidationException("Validation failed: value is not a boolean");
    }
  }
}
