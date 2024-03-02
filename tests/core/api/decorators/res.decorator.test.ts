import "reflect-metadata";

import { Res } from "@core/api/decorators/res.decorator";
import { RES_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import TestClass from "tests/utils/test-class.util";

describe("Res decorator", () => {
  it("should set metadata for a method parameter", () => {
    Res()(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      RES_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBe(0);
  });

  it("should throw an error if used outside a method", () => {
    expect(() => Res()(TestClass.prototype, undefined, 0)).toThrowError(
      "Res decorator must be used in a method"
    );
  });
});
