import { ValidationResult } from "../types";
import { ValidationDecorator } from "./validation-decorator.function";

export function createValidationDecorator(
  validate: (value: any) => ValidationResult,
  defaultError?: string
): () => PropertyDecorator {
  return () => ValidationDecorator({ validate, defaultError });
}
