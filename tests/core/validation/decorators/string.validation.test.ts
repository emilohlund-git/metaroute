import { MetaRouteValidators } from "@core/validation/constants/metaroute-validator.constant";
import "reflect-metadata";
import { IsString, VALIDATION_METADATA_KEY, validator } from "src";

describe("IsString decorator", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsString()
      public prop!: string;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Value must be a string.",
        key: "prop",
        validate: MetaRouteValidators.string.validate,
      },
    ]);
  });

  it("should not overwrite existing metadata", () => {
    class TestClass {
      @IsString()
      public prop1!: string;

      @IsString()
      public prop2!: string;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Value must be a string.",
        key: "prop1",
        validate: MetaRouteValidators.string.validate,
      },
      {
        defaultError: "Value must be a string.",
        key: "prop2",
        validate: MetaRouteValidators.string.validate,
      },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    class TestClass {
      @IsString()
      public prop!: string;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(undefined);
  });

  it("should return an error if the value is not a string", () => {
    class TestClass {
      @IsString()
      public prop!: string;
    }

    const instance = new TestClass();
    instance.prop = 1234 as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Value must be a string."],
    });
  });
});
