import "reflect-metadata";
import { MetaRouteValidators } from "@core/validation/constants/metaroute-validator.constant";
import { IsBoolean } from "@validation/decorators";
import { VALIDATION_METADATA_KEY } from "@common/constants";
import { validator } from "@validation/functions";

describe("IsBoolean", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsBoolean()
      public prop!: boolean;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Value must be a boolean.",
        key: "prop",
        validate: MetaRouteValidators.boolean.validate,
      },
    ]);
  });

  it("should not overwrite existing metadata", () => {
    class TestClass {
      @IsBoolean()
      public prop1!: boolean;

      @IsBoolean()
      public prop2!: boolean;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Value must be a boolean.",
        key: "prop1",
        validate: MetaRouteValidators.boolean.validate,
      },
      {
        defaultError: "Value must be a boolean.",
        key: "prop2",
        validate: MetaRouteValidators.boolean.validate,
      },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    class TestClass {
      @IsBoolean()
      public prop!: boolean;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(undefined);
  });

  it("should not set the default value if the property is already defined", () => {
    class TestClass {
      @IsBoolean()
      public prop = false;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(false);
  });

  it("should use the custom error message if it is defined", () => {
    class TestClass {
      @IsBoolean("Custom error message.")
      public prop!: boolean;
    }

    const instance = new TestClass();
    instance.prop = "not a boolean" as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Custom error message."],
    });
  });

  it("should not return an error if the value is a boolean", () => {
    class TestClass {
      @IsBoolean()
      public prop!: boolean;
    }

    const instance = new TestClass();
    instance.prop = true;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({});
  });

  it("should return an error if the value is not a boolean", () => {
    class TestClass {
      @IsBoolean()
      public prop!: boolean;
    }

    const instance = new TestClass();
    instance.prop = "not a boolean" as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Value must be a boolean."],
    });
  });
});
