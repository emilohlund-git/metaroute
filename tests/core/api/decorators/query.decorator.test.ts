import "reflect-metadata";
import TestClass from "tests/utils/test-class.util";
import { Query } from "@core/api/decorators/query.decorator";
import { QUERY_METADATA_KEY } from "@common/constants";

describe("Query decorator", () => {
  it("should set metadata for a method parameter", () => {
    const pipe = class {
      transform(value: any) {
        return value;
      }
    };
    Query("test", pipe)(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      QUERY_METADATA_KEY,
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
    Query(undefined, pipe)(TestClass.prototype, "testMethod", 0);

    const metadata = Reflect.getMetadata(
      QUERY_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toBeDefined();
    expect(metadata["all"]).toEqual({ index: 0, pipe });
  });

  it("should throw an error if used outside a method", () => {
    expect(() => Query()(TestClass.prototype, undefined, 0)).toThrowError(
      "Query decorator must be used in a method"
    );
  });
});
