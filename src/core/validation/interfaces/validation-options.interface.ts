import { ValidationResult } from "../types";

export interface ValidationOptions {
  validate: (value: any) => ValidationResult;
  defaultError: string;
}
