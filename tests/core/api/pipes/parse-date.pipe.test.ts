import { ParseDatePipe } from "src";

describe("ParseDatePipe", () => {
  let pipe: ParseDatePipe;

  beforeEach(() => {
    pipe = new ParseDatePipe();
  });

  it("should return a Date object for valid date strings", () => {
    const date = new Date();
    expect(pipe.transform(date.toISOString())).toEqual(date);
  });

  it("should throw an error for non-date strings", () => {
    expect(() => pipe.transform("not a date")).toThrow(
      "Validation failed: value is not a number"
    );
  });
});
