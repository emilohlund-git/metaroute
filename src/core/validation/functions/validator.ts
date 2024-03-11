import { VALIDATION_METADATA_KEY } from "../..";
import { ConsoleLogger } from "../../common/services/console-logger.service";
import { ErrorResult, ValidationResult } from "../types";

function processValidationResult(
  validationResult: ValidationResult,
  errors: Record<string, ErrorResult[]>,
  key: string,
  defaultError?: string
): void {
  if (validationResult === null || validationResult === true) return;

  let errorMessage: string | undefined;

  if (typeof validationResult === "string") {
    errorMessage = defaultError ?? validationResult;
  } else if (typeof validationResult === "object" && !validationResult.valid) {
    errorMessage = defaultError ?? validationResult.message;
  } else if (validationResult === false) {
    errorMessage = defaultError ?? "Validation failed";
  }

  if (errorMessage) {
    if (!errors[key]) errors[key] = [];
    errors[key].push(errorMessage);
  }
}

export function validator<T extends Object>(
  requestBody: T,
  schemaType: new () => T,
  omitKeys: (keyof T)[] = []
): Record<string, ErrorResult[]> {
  const errors: Record<string, ErrorResult[]> = {};
  const logger = new ConsoleLogger("Validator");

  const schemaInstance: T = new schemaType();
  Object.assign(schemaInstance, requestBody);

  const metadata = Reflect.getMetadata(
    VALIDATION_METADATA_KEY,
    schemaInstance
  ) as {
    key: string;
    validate: (value: any) => ValidationResult;
    defaultError?: string;
  }[];

  if (!metadata) {
    logger.debug(
      `No validation metadata found for ${schemaInstance.constructor.name}`
    );
    return errors;
  }

  for (const { key, validate, defaultError } of metadata) {
    if (omitKeys.includes(key as keyof T)) continue;

    if (!(key in requestBody)) {
      if (!errors[key]) errors[key] = [];
      errors[key].push("Property is missing");
      continue;
    }

    const value = schemaInstance[key as keyof T];
    const validationResult = validate(value);

    processValidationResult(validationResult, errors, key, defaultError);
  }

  if (Object.keys(errors).length > 0) {
    logger.error("Validation errors", errors);
  }

  return errors;
}
