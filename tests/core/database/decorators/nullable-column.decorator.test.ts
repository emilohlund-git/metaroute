import { DATABASE_COLUMN_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { NullableColumn } from "@core/database/decorators/nullable-column.decorator";
import "reflect-metadata";

describe("NullableColumn", () => {
  it("should define metadata for the target with default type as string", () => {
    class TestClass {
      @NullableColumn()
      public testProp: any;
    }

    const metadata = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        key: "testProp",
        type: "string",
        isPrimary: false,
        isUnique: false,
      },
    ]);
  });

  it("should define metadata for the target with provided options", () => {
    class TestClass {
      @NullableColumn({ type: "number", unique: true, defaultValue: 10 })
      public testProp: any;
    }

    const metadata = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        key: "testProp",
        type: "number",
        isPrimary: false,
        isUnique: true,
      },
    ]);

    const instance = new TestClass();
    expect(instance.testProp).toBe(10);
  });

  it("should append to existing metadata if it exists", () => {
    class TestClass {
      @NullableColumn({ type: "boolean", unique: false, defaultValue: true })
      public testProp1: any;

      @NullableColumn({ type: "date", unique: true, defaultValue: new Date() })
      public testProp2: any;
    }

    const metadata = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      TestClass.prototype
    );
    expect(metadata).toEqual([
      {
        key: "testProp1",
        type: "boolean",
        isPrimary: false,
        isUnique: false,
      },
      {
        key: "testProp2",
        type: "date",
        isPrimary: false,
        isUnique: true,
      },
    ]);

    const instance = new TestClass();
    expect(instance.testProp1).toBe(true);
    expect(instance.testProp2).toBeInstanceOf(Date);
  });
});
