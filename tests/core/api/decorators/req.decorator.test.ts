import "reflect-metadata";

import { Req } from "@core/api/decorators/req.decorator";
import { REQ_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import TestClass from "tests/utils/test-class.util";

describe("Req decorator", () => {
  it("should set metadata for a method parameter", () => {
    Req()(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      REQ_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBe(0);
  });

  it("should throw an error if used outside a method", () => {
    expect(() => Req()(TestClass.prototype, undefined, 0)).toThrowError(
      "Req decorator must be used in a method"
    );
  });
});
