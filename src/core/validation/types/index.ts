export type ValidationResult = boolean | { valid: boolean; message: string };
export type ErrorResult =
  | string
  | false
  | {
      valid: boolean;
      message: string;
    }
  | undefined;
