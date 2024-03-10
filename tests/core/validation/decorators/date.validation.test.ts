import { MetaRouteValidators } from "@core/validation/constants/metaroute-validator.constant";
import "reflect-metadata";
import { IsDate, VALIDATION_METADATA_KEY, validator } from "src";

describe("IsDate", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsDate()
      public prop!: Date;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toEqual([
      {
        defaultError: "Value must be a date.",
        key: "prop",
        validate: MetaRouteValidators.date.validate,
      },
    ]);
  });

  it("should not overwrite existing metadata", () => {
    class TestClass {
      @IsDate()
      public prop1!: Date;

      @IsDate()
      public prop2!: Date;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toEqual([
      {
        defaultError: "Value must be a date.",
        key: "prop1",
        validate: MetaRouteValidators.date.validate,
      },
      {
        defaultError: "Value must be a date.",
        key: "prop2",
        validate: MetaRouteValidators.date.validate,
      },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    class TestClass {
      @IsDate()
      public prop!: Date;
    }

    const instance = new TestClass();

    expect(instance.prop).toEqual(undefined);
  });

  it("should return an error if the value is not a date", () => {
    class TestClass {
      @IsDate()
      public prop!: Date;
    }

    const instance = new TestClass();
    instance.prop = "not a date" as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Value must be a date."],
    });
  });
});
