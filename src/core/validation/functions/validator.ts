import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { ConsoleLogger } from "../../common/services/console-logger.service";

const validators = {
  email: {
    validate: (value: string) => {
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
        return "Not a valid email.";
      }
      return null;
    },
  },
  password: {
    validate: (value: string) => {
      if (value.length < 8) return "Password must be at least 8 characters.";
      if (value.length > 20)
        return "Password must be no more than 20 characters.";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter.";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter.";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one digit.";
      return null;
    },
  },
  string: {
    validate: (value: string) => {
      if (typeof value !== "string") {
        return "Must be a string.";
      }
      return null;
    },
  },
  number: {
    validate: (value: string) => {
      if (typeof value !== "number") {
        return "Must be a number.";
      }
      return null;
    },
  },
  username: {
    validate: (value: string) => {
      if (value.length < 3) return "Username must be at least 3 characters.";
      if (!/^[a-zA-Z0-9._-]+$/.test(value))
        return "Username can only include alphanumeric characters, periods, underscores, and hyphens.";
      return null;
    },
  },
  boolean: {
    validate: (value: string) => {
      if (typeof value !== "boolean") {
        return "Must be a boolean.";
      }
      return null;
    },
  },
  date: {
    validate: (value: string) => {
      if (
        !/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(([+-]\d{2}:\d{2})|Z)?$/.test(
          value
        )
      ) {
        return "Not a valid ISO 8601 date. It should be in the format: YYYY-MM-DDTHH:mm:ss.sssZ";
      }
      return null;
    },
  },
  enum: {
    validate: (value: string, enumValues: any[]) => {
      if (!enumValues.includes(value)) {
        return `Value must be one of: ${enumValues.join(", ")}`;
      }
      return null;
    },
  },
};

export function validator<T extends Object>(
  obj: T,
  type: new () => T,
  ignore?: string[]
): Record<string, string[]> {
  const logger = new ConsoleLogger("Validator");
  const instance = new type();

  const properties: { key: string; type: string }[] = Reflect.getMetadata(
    VALIDATION_METADATA_KEY,
    instance
  );

  const keys = Object.keys(obj);
  const errors: Record<string, string[]> = {};

  for (const property of properties) {
    if (!keys.includes(property.key)) {
      errors[property.key] = errors[property.key] || [];
      errors[property.key].push("Property is missing");
    }
  }

  for (const key of keys) {
    if (ignore && ignore.includes(key)) {
      continue;
    }

    const property = properties.find((p) => p.key === key);
    if (!property) {
      continue;
    }

    const value = obj[key as keyof T];
    const type = property.type as keyof typeof validators;

    let errorMessage;
    if (type === "enum") {
      /* @ts-ignore */
      const enumValues = property.enumValues;
      errorMessage = validators[type].validate(value as string, enumValues);
    } else {
      errorMessage = validators[type].validate(value as string);
    }

    if (errorMessage) {
      errors[key] = errors[key] || [];
      errors[key].push(errorMessage);
    }
  }

  if (Object.keys(errors).length > 0) {
    logger.error(`Validation errors`, errors);
  }

  return errors;
}
