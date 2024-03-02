import { Headers } from "@core/api/decorators/headers.decorator";
import { HEADERS_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import "reflect-metadata";
import TestClass from "tests/utils/test-class.util";

describe("Headers decorator", () => {
  it("should set metadata for a method parameter", () => {
    Headers("test")(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      HEADERS_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBeDefined();
    expect(metadata["test"]).toBe(0);
  });

  it("should set metadata for all headers if no key is provided", () => {
    Headers()(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      HEADERS_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBeDefined();
    expect(metadata["all"]).toBe(0);
  });

  it("should throw an error if used outside a method", () => {
    expect(() => Headers()(TestClass.prototype, undefined, 0)).toThrowError(
      "Headers decorator must be used in a method"
    );
  });
});
