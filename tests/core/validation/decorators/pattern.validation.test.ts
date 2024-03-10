import { IsPattern } from "@core/validation/decorators/pattern.validation";
import "reflect-metadata";
import { VALIDATION_METADATA_KEY, validator } from "src";

describe("IsPattern", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsPattern(/^\\d+$/)
      public prop!: string;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Pattern is not valid.",
        key: "prop",
        validate: expect.any(Function),
      },
    ]);
  });

  it("should append to existing metadata for the target", () => {
    class TestClass {
      @IsPattern(/^\\d+$/)
      public prop1!: string;

      @IsPattern(/^\\d+$/)
      public prop2!: string;
    }

    const metadata = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        defaultError: "Pattern is not valid.",
        key: "prop1",
        validate: expect.any(Function),
      },
      {
        defaultError: "Pattern is not valid.",
        key: "prop2",
        validate: expect.any(Function),
      },
    ]);
  });

  it("should set the default value for the property if it is not already set", () => {
    class TestClass {
      @IsPattern(/^\\d+$/)
      public prop!: string;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(undefined);
  });

  it("should not overwrite the value of the property if it is already set", () => {
    class TestClass {
      @IsPattern(/^\\d+$/)
      public prop = "123";
    }

    const instance = new TestClass();
    expect(instance.prop).toBe("123");
  });

  it("should return an error if the value is not a pattern", () => {
    class TestClass {
      @IsPattern(/^\\d+$/)
      public prop!: string;
    }

    const instance = new TestClass();
    instance.prop = "not matching regexp" as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Pattern is not valid."],
    });
  });

  it("should not return an error if the value is a pattern", () => {
    class TestClass {
      @IsPattern(/^\d+$/)
      public prop!: string;
    }

    const instance = new TestClass();
    instance.prop = "123";

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({});
  });
});
