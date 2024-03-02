import "reflect-metadata";

import { Body } from "@core/api/decorators/body.decorator";
import { BODY_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import TestClass from "tests/utils/test-class.util";

describe("Body Decorator", () => {
  it("should set metadata for a method parameter", () => {
    const metadata = Reflect.getMetadata(
      BODY_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBeDefined();
    expect(metadata.types[0]).toBe(Object);
    expect(metadata.parameterIndex).toBe(0);
  });

  it("should throw an error if used outside a method", () => {
    expect(() => Body()(TestClass.prototype, undefined, 0)).toThrowError(
      "Body decorator must be used in a method"
    );
  });
});
