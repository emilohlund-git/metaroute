import "reflect-metadata";
import { IsUsername, VALIDATION_METADATA_KEY } from "src";

describe("IsUsername", () => {
  it("should set metadata for the property it is applied to", () => {
    class TestClass {
      @IsUsername()
      public prop!: string;
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(VALIDATION_METADATA_KEY, instance);

    expect(metadata).toBeDefined();
    expect(Array.isArray(metadata)).toBe(true);
    expect(metadata[0].key).toBe("prop");
    expect(metadata[0].type).toBe("username");
  });

  it("should set default value for the property it is applied to", () => {
    class TestClass {
      @IsUsername("defaultUsername")
      public prop!: string;
    }

    const instance = new TestClass();

    expect(instance.prop).toBe("defaultUsername");
  });
});
