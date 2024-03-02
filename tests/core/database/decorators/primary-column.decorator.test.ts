import { DATABASE_COLUMN_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { PrimaryColumn } from "@core/database/decorators/primary-column.decorator";
import "reflect-metadata";

describe("PrimaryColumn Decorator", () => {
  it("should define metadata for the decorated property", () => {
    class TestClass {
      @PrimaryColumn("default")
      public testProp: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      instance
    );

    expect(metadata.length).toBeGreaterThan(0);
  });

  it("should set default value for the decorated property", () => {
    class TestClass {
      @PrimaryColumn("default")
      public testProp: string;
    }

    const instance = new TestClass();
    expect(instance.testProp).toEqual("default");
  });

  it("should not overwrite existing value of the decorated property", () => {
    class TestClass {
      @PrimaryColumn("default")
      public testProp: string = "existing";
    }

    const instance = new TestClass();
    expect(instance.testProp).toEqual("existing");
  });
});
