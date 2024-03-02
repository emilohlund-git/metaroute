export class ParseIntPipe {
  transform(value: any): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new Error("Validation failed: value is not a number");
    }
    return val;
  }
}
