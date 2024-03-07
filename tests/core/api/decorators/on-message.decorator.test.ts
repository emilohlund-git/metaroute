import "reflect-metadata";

import { ON_MESSAGE_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import TestClass from "tests/utils/test-class.util";
import { OnMessage } from "src";

describe("OnMessage decorator", () => {
  it("should set metadata for a method", () => {
    const descriptor = {
      value: TestClass.prototype.testMethod,
    };

    OnMessage("testEvent")(TestClass.prototype, "testMethod", descriptor);

    const metadata = Reflect.getMetadata(
      ON_MESSAGE_METADATA_KEY,
      descriptor.value
    );
    expect(metadata).toBe("testEvent");
  });
});
