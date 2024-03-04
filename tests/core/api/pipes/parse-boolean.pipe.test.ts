import { ParseBooleanPipe } from "src";

describe("ParseBooleanPipe", () => {
  let pipe: ParseBooleanPipe;

  beforeEach(() => {
    pipe = new ParseBooleanPipe();
  });

  it('should return true for "true"', () => {
    expect(pipe.transform("true")).toBe(true);
  });

  it('should return true for "1"', () => {
    expect(pipe.transform("1")).toBe(true);
  });

  it('should return false for "false"', () => {
    expect(pipe.transform("false")).toBe(false);
  });

  it('should return false for "0"', () => {
    expect(pipe.transform("0")).toBe(false);
  });

  it("should throw an error for non-boolean values", () => {
    expect(() => pipe.transform("not a boolean")).toThrowError(
      "Validation failed: value is not a boolean"
    );
  });
});
