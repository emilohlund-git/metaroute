export class ParseDatePipe {
  transform(value: string): Date {
    const val = new Date(value);
    if (isNaN(val.getTime())) {
      throw new Error("Validation failed: value is not a number");
    }
    return val;
  }
}
