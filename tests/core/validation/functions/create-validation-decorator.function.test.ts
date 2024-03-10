import { createValidationDecorator } from "@core/validation/functions/create-validation-decorator.function";
import "reflect-metadata";
import { VALIDATION_METADATA_KEY, validator } from "src";

describe("createValidationDecorator", () => {
  it("should define metadata for the target object", () => {
    const validate = jest.fn();
    const defaultError = "Default error message";
    const decorator = createValidationDecorator(validate, defaultError);

    class TestClass {
      @decorator()
      property: string;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toHaveLength(1);
    expect(metadata[0]).toEqual({
      key: "property",
      validate,
      defaultError: defaultError,
    });
  });

  it("should not overwrite existing metadata", () => {
    const validate1 = jest.fn();
    const defaultError1 = "Default error message 1";
    const decorator1 = createValidationDecorator(validate1, defaultError1);

    const validate2 = jest.fn();
    const defaultError2 = "Default error message 2";
    const decorator2 = createValidationDecorator(validate2, defaultError2);

    class TestClass {
      @decorator1()
      property1: string;

      @decorator2()
      property2: string;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toHaveLength(2);
    expect(metadata).toContainEqual({
      key: "property1",
      validate: validate1,
      defaultError: defaultError1,
    });
    expect(metadata).toContainEqual({
      key: "property2",
      validate: validate2,
      defaultError: defaultError2,
    });
  });

  it("should validate the property with the provided function and default error message", () => {
    const validate = (value: any) => value === "valid";
    const decorator = createValidationDecorator(validate, "Invalid value");

    class TestClass {
      @decorator()
      property: string;
    }

    const instance = new TestClass();
    instance.property = "invalid";

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      property: ["Invalid value"],
    });
  });

  it("should validate the property with the provided function and return no errors", () => {
    const validate = (value: any) => value === "valid";
    const decorator = createValidationDecorator(validate, "Invalid value");

    class TestClass {
      @decorator()
      property: string;
    }

    const instance = new TestClass();
    instance.property = "valid";

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({});
  });
});
