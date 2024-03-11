import "reflect-metadata";
import { IsEnum } from "@validation/decorators";
import { VALIDATION_METADATA_KEY } from "@common/constants";
import { validator } from "@validation/functions";

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
    expect(metadata).toEqual([
      {
        defaultError: undefined,
        key: "field",
        validate: expect.any(Function),
      },
    ]);
  });

  it("should set default value if target property is undefined", () => {
    class TestClass {
      @IsEnum(TestEnum)
      public field: string;
    }

    const instance = new TestClass();
    expect(instance.field).toBe(undefined);
  });

  it("should not overwrite existing value of target property", () => {
    class TestClass {
      @IsEnum(TestEnum)
      public field: string = TestEnum.A;
    }

    const instance = new TestClass();
    expect(instance.field).toBe(TestEnum.A);
  });

  it("should return an error if the value is not a date", () => {
    class TestClass {
      @IsEnum(TestEnum, "Not a valid enum value.")
      public prop!: TestEnum;
    }

    const instance = new TestClass();
    instance.prop = "not an enum" as any;

    const errors = validator(instance, TestClass);

    expect(errors).toEqual({
      prop: ["Not a valid enum value."],
    });
  });
});
