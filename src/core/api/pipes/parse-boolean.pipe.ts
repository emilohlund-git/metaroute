export class ParseBooleanPipe {
  transform(value: any): boolean {
    if (value === "true" || value === "1") {
      return true;
    } else if (value === "false" || value === "0") {
      return false;
    } else {
      throw new Error("Validation failed: value is not a boolean");
    }
  }
}
