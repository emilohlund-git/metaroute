import { ValidationException } from "../exceptions";
import { ValidationPipe } from "./validation-pipe.abstract";

export class ParseIntPipe extends ValidationPipe {
  transform(value: any): number {
    if (!/^\d+$/.test(value)) {
      throw new ValidationException("Validation failed: value is not a number");
    }
    const val = parseInt(value, 10);
    return val;
  }
}
