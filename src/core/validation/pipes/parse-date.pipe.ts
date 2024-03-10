import { ValidationException } from "../exceptions";
import { ValidationPipe } from "./validation-pipe.abstract";

export class ParseDatePipe extends ValidationPipe {
  transform(value: string): Date {
    const val = new Date(value);
    if (isNaN(val.getTime())) {
      throw new ValidationException("Validation failed: value is not a valid date");
    }
    return val;
  }
}
