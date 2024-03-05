import "reflect-metadata";
import { IsString, VALIDATION_METADATA_KEY } from "src";

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
    expect(metadata).toEqual([{ key: "prop", type: "string" }]);
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
      { key: "prop1", type: "string" },
      { key: "prop2", type: "string" },
    ]);
  });

  it("should set the default value if the property is undefined", () => {
    class TestClass {
      @IsString("default")
      public prop!: string;
    }

    const instance = new TestClass();
    expect(instance.prop).toBe("default");
  });
});
