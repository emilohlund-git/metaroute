import "reflect-metadata";

import { RateLimit } from "@core/api/decorators/rate-limiter.decorator";
import { RATE_LIMITER_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { RateLimiterOptions } from "@core/common/interfaces/rate-limiter.interface";
import TestClass from "tests/utils/test-class.util";

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
