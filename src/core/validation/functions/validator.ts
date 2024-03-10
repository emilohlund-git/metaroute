import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { ConsoleLogger } from "../../common/services/console-logger.service";
import { ErrorResult, ValidationResult } from "../types";

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

    if (validationResult === null) continue;

    if (typeof validationResult === "string") {
      if (!errors[key]) errors[key] = [];
      errors[key].push(defaultError || validationResult);
    }

    if (typeof validationResult === "object" && !validationResult.valid) {
      if (!errors[key]) errors[key] = [];
      errors[key].push(defaultError || validationResult.message);
    }

    if (validationResult === false) {
      if (!errors[key]) errors[key] = [];
      errors[key].push(defaultError || "Validation failed");
    }

    if (validationResult === true) {
      if (errors[key]) delete errors[key];
    }
  }

  if (Object.keys(errors).length > 0) {
    logger.error("Validation errors", errors);
  }

  return errors;
}
