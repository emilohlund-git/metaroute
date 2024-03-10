import { MetaRouteValidators } from "@core/validation/constants/metaroute-validator.constant";
import "reflect-metadata";
import { IsNumber, VALIDATION_METADATA_KEY, validator } from "src";

describe("IsNumber", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsNumber()
      public prop!: number;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Value must be a number.",
        key: "prop",
        validate: MetaRouteValidators.number.validate,
      },
    ]);
  });

  it("should append to existing metadata for the target", () => {
    class TestClass {
      @IsNumber()
      public prop1!: number;

      @IsNumber()
      public prop2!: number;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Value must be a number.",
        key: "prop1",
        validate: MetaRouteValidators.number.validate,
      },
      {
        defaultError: "Value must be a number.",
        key: "prop2",
        validate: MetaRouteValidators.number.validate,
      },
    ]);
  });

  it("should set the default value for the property if it is not already set", () => {
    class TestClass {
      @IsNumber()
      public prop!: number;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(undefined);
  });

  it("should not overwrite the value of the property if it is already set", () => {
    class TestClass {
      @IsNumber()
      public prop = 24;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(24);
  });

  it("should return an error if the value is not a number", () => {
    class TestClass {
      @IsNumber()
      public prop!: number;
    }

    const instance = new TestClass();
    instance.prop = "not a number" as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Value must be a number."],
    });
  });
});
