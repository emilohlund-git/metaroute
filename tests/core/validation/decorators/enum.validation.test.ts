import "reflect-metadata";
import { IsEnum, VALIDATION_METADATA_KEY } from "src";

describe("IsEnum", () => {
  enum TestEnum {
    A = "A",
    B = "B",
  }

  it("should define metadata for the target", () => {
    class TestClass {
      @IsEnum(TestEnum)
      public field: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toBeDefined();
    expect(metadata).toHaveLength(1);
    expect(metadata[0]).toEqual({
      key: "field",
      type: "enum",
      enumValues: Object.values(TestEnum),
    });
  });

  it("should set default value if target property is undefined", () => {
    class TestClass {
      @IsEnum(TestEnum, TestEnum.B)
      public field: string;
    }

    const instance = new TestClass();
    expect(instance.field).toBe(TestEnum.B);
  });

  it("should not overwrite existing value of target property", () => {
    class TestClass {
      @IsEnum(TestEnum, TestEnum.B)
      public field: string = TestEnum.A;
    }

    const instance = new TestClass();
    expect(instance.field).toBe(TestEnum.A);
  });
});
