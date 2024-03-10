import { TokenBucket } from "../../services/token-bucket.service";
import { RateLimiterOptions } from "../../../common/interfaces/rate-limiter.interface";
import { ResponseEntity } from "../../entities/response.entity";
import { MetaRouteRequest } from "../../../api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../../../api/server/interfaces/meta-route.response";
import { NextFunction } from "../../types";

export async function createRateLimiterMiddleware(
  options: RateLimiterOptions,
  key: string
) {
  const buckets: { [key: string]: TokenBucket } = {};

  return async (
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    next: NextFunction
  ) => {
    const user = req.ip;
    if (!user) return next();

    const bucketKey = `${user}-${key}`;
    let bucket = buckets[bucketKey];
    if (!bucket) {
      bucket = new TokenBucket(options.tokensPerSecond, options.bucketSize);
      buckets[bucketKey] = bucket;
    }

    res.setHeader("X-Ratelimit-Remaining", bucket.availableTokens().toString());
    res.setHeader("X-Ratelimit-Limit", bucket.limit().toString());
    res.setHeader(
      "X-Ratelimit-Retry-After",
      bucket.timeToNextRefill().toString()
    );

    if (!bucket.consume()) {
      res.status(429).send(ResponseEntity.tooManyRequests("Too many requests"));
    } else {
      next();
    }
  };
}
