import { ParseIntPipe } from "@validation/pipes";

describe("ParseIntPipe", () => {
  let pipe: ParseIntPipe;

  beforeEach(() => {
    pipe = new ParseIntPipe();
  });

  it("should return a number for valid integer strings", () => {
    expect(pipe.transform("123")).toBe(123);
  });

  it("should return a number for valid integer numbers", () => {
    expect(pipe.transform(123)).toBe(123);
  });

  it("should throw an error for non-integer strings", () => {
    expect(() => pipe.transform("not a number")).toThrow(
      "Validation failed: value is not a number"
    );
  });

  it("should throw an error for non-integer values", () => {
    expect(() => pipe.transform({})).toThrow(
      "Validation failed: value is not a number"
    );
  });
});
