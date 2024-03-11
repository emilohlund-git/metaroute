import { ValidationException } from "@validation/exceptions";
import { createValidationPipe } from "@validation/functions";
import { ValidationPipe } from "@validation/pipes";

describe("createValidationPipe", () => {
  it("should return a class that extends ValidationPipe", () => {
    const validateFn = (value: any) => true;
    const pipeClass = createValidationPipe(validateFn);
    expect(pipeClass.prototype instanceof ValidationPipe).toBe(true);
  });

  it("should transform the value if validation passes", () => {
    const validateFn = (value: any) => true;
    const pipeClass = createValidationPipe(validateFn);
    const pipeInstance = new pipeClass();
    const value = "example";
    expect(pipeInstance.transform(value)).toBe(value);
  });

  it("should throw a ValidationException if validation fails", () => {
    const validateFn = (value: any) => false;
    const defaultError = "Validation failed";
    const pipeClass = createValidationPipe(validateFn, defaultError);
    const pipeInstance = new pipeClass();
    const value = "example";
    expect(() => pipeInstance.transform(value)).toThrow(ValidationException);
  });

  it("should throw a ValidationException with the default error message if no error message is provided", () => {
    const validateFn = (value: any) => false;
    const pipeClass = createValidationPipe(validateFn);
    const pipeInstance = new pipeClass();
    const value = "example";
    expect(() => pipeInstance.transform(value)).toThrow("Validation failed");
  });
});
