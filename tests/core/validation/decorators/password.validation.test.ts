import "reflect-metadata";
import { IsPassword, VALIDATION_METADATA_KEY } from "src";

describe("IsPassword", () => {
  it("should define metadata for the target with the property key and type", () => {
    class TestClass {
      @IsPassword("defaultPassword")
      password: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toEqual([{ key: "password", type: "password" }]);
  });

  it("should set the default value if the target property is not defined", () => {
    class TestClass {
      @IsPassword("defaultPassword")
      password: string;
    }

    const instance = new TestClass();

    expect(instance.password).toEqual("defaultPassword");
  });

  it("should not overwrite the existing value of the target property", () => {
    class TestClass {
      @IsPassword("defaultPassword")
      password = "existingPassword";
    }

    const instance = new TestClass();

    expect(instance.password).toEqual("existingPassword");
  });
});
