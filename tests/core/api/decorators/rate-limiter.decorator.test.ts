import "reflect-metadata";

import { RateLimit } from "@core/api/decorators/rate-limiter.decorator";
import TestClass from "tests/utils/test-class.util";
import { RATE_LIMITER_METADATA_KEY } from "@common/constants";
import { RateLimiterOptions } from "@api/interfaces";

describe("RateLimit decorator", () => {
  it("should set metadata for a method", () => {
    const options: RateLimiterOptions = {
      bucketSize: 2,
      tokensPerSecond: 2,
    };
    RateLimit(options)(TestClass.prototype, "testMethod", {});

    const metadata = Reflect.getMetadata(
      RATE_LIMITER_METADATA_KEY,
      TestClass.prototype,
      "testMethod"
    );
    expect(metadata).toEqual(options);
  });
});
