import "reflect-metadata";
import { IsDate, VALIDATION_METADATA_KEY } from "src";

describe("IsDate", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsDate()
      public prop!: Date;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toEqual([{ key: "prop", type: "date" }]);
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
      { key: "prop1", type: "date" },
      { key: "prop2", type: "date" },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    const defaultValue = new Date();

    class TestClass {
      @IsDate(defaultValue)
      public prop!: Date;
    }

    const instance = new TestClass();

    expect(instance.prop).toEqual(defaultValue);
  });
});
