import "reflect-metadata";

import { Param } from "@core/api/decorators/param.decorator";
import TestClass from "tests/utils/test-class.util";
import { PARAM_METADATA_KEY } from "@common/constants";

describe("Param decorator", () => {
  it("should set metadata for a method parameter", () => {
    const pipe = class {
      transform(value: any) {
        return value;
      }
    };
    Param("test", pipe)(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      PARAM_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBeDefined();
    expect(metadata["test"]).toEqual({ index: 0, pipe });
  });

  it("should set metadata for all parameters if no key is provided", () => {
    const pipe = class {
      transform(value: any) {
        return value;
      }
    };
    Param(undefined, pipe)(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      PARAM_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBeDefined();
    expect(metadata["all"]).toEqual({ index: 0, pipe });
  });

  it("should throw an error if used outside a method", () => {
    expect(() => Param()(TestClass.prototype, undefined, 0)).toThrowError(
      "Param decorator must be used in a method"
    );
  });
});
