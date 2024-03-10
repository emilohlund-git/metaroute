export const MetaRouteValidators = {
  string: {
    validate: (value: string) => {
      if (typeof value !== "string") {
        return {
          valid: false,
          message: "Must be a string.",
        };
      }
      return {
        valid: true,
      };
    },
  },
  number: {
    validate: (value: string) => {
      if (typeof value !== "number") {
        return {
          valid: false,
          message: "Must be a number.",
        };
      }
      return {
        valid: true,
      };
    },
  },
  boolean: {
    validate: (value: boolean) => {
      if (typeof value !== "boolean") {
        return {
          valid: false,
          message: "Must be a boolean.",
        };
      }
      return {
        valid: true,
      };
    },
  },
  date: {
    validate: (value: string) => {
      if (
        !/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(([+-]\d{2}:\d{2})|Z)?$/.test(
          value
        )
      ) {
        return {
          valid: false,
          message:
            "Not a valid ISO 8601 date. It should be in the format: YYYY-MM-DDTHH:mm:ss.sssZ",
        };
      }
      return {
        valid: true,
      };
    },
  },
  enum: {
    validate: (
      value: any,
      enumValues: any[],
      defaultError: string = "Value is not valid."
    ) => {
      if (!enumValues.includes(value)) {
        return {
          valid: false,
          message: defaultError,
        };
      }
      return {
        valid: true,
      };
    },
  },
  pattern: {
    validate: (
      value: string,
      pattern: RegExp,
      defaultError: string = "Pattern is not valid."
    ) => {
      try {
        if (!pattern.test(value)) {
          return {
            valid: false,
            message: defaultError,
          };
        }
        return {
          valid: true,
        };
      } catch (e) {
        return {
          valid: false,
          message: defaultError,
        };
      }
    },
  },
};
