import { DATABASE_COLUMN_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { Column } from "@core/database/decorators/column.decorator";
import "reflect-metadata";

describe("Column Decorator", () => {
  it("should define metadata for the target with default values", () => {
    class TestClass {
      @Column()
      public testProperty: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      instance
    );

    expect(metadata).toHaveLength(1);
    expect(metadata[0]).toEqual({
      key: "testProperty",
      type: "string",
      isPrimary: false,
      isUnique: false,
    });
  });

  it("should define metadata for the target with unique option", () => {
    class TestClass {
      @Column({ unique: true })
      public testProperty: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      instance
    );

    expect(metadata).toHaveLength(1);
    expect(metadata[0]).toEqual({
      key: "testProperty",
      type: "string",
      isPrimary: false,
      isUnique: true,
    });
  });

  it("should define default value for the target property", () => {
    class TestClass {
      @Column({ defaultValue: "default" })
      public testProperty: string;
    }

    const instance = new TestClass();

    expect(instance.testProperty).toBe("default");
  });
});
