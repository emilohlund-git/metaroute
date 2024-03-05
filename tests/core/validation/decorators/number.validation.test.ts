import "reflect-metadata";
import { IsNumber, VALIDATION_METADATA_KEY } from "src";

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
    expect(metadata).toEqual([{ key: "prop", type: "number" }]);
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
      { key: "prop1", type: "number" },
      { key: "prop2", type: "number" },
    ]);
  });

  it("should set the default value for the property if it is not already set", () => {
    class TestClass {
      @IsNumber(42)
      public prop!: number;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(42);
  });

  it("should not overwrite the value of the property if it is already set", () => {
    class TestClass {
      @IsNumber(42)
      public prop = 24;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(24);
  });
});
