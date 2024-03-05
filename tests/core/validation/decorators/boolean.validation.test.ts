import "reflect-metadata";
import { IsBoolean, VALIDATION_METADATA_KEY } from "src";

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
    expect(metadata).toEqual([{ key: "prop", type: "boolean" }]);
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
      { key: "prop1", type: "boolean" },
      { key: "prop2", type: "boolean" },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    class TestClass {
      @IsBoolean(true)
      public prop!: boolean;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(true);
  });

  it("should not set the default value if the property is already defined", () => {
    class TestClass {
      @IsBoolean(true)
      public prop = false;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe(false);
  });
});
