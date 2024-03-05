import "reflect-metadata";
import { IsEmail, VALIDATION_METADATA_KEY } from "src";

describe("IsEmail", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsEmail()
      public prop!: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toEqual([{ key: "prop", type: "email" }]);
  });

  it("should not overwrite existing metadata", () => {
    class TestClass {
      @IsEmail()
      public prop1!: string;

      @IsEmail()
      public prop2!: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toEqual([
      { key: "prop1", type: "email" },
      { key: "prop2", type: "email" },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    const defaultValue = "default@email.com";

    class TestClass {
      @IsEmail(defaultValue)
      public prop!: string;
    }

    const instance = new TestClass();

    expect(instance.prop).toEqual(defaultValue);
  });
});
