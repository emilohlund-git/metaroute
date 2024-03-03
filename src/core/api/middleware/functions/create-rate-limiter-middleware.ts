import { TokenBucket } from "../../services/token-bucket.service";
import { RateLimiterOptions } from "../../../common/interfaces/rate-limiter.interface";
import { ResponseEntity } from "../../entities/response.entity";
import { NextFunction } from "../../../api/server/types";
import { MetaRouteRequest } from "../../../api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../../../api/server/interfaces/meta-route.response";

export function createRateLimiterMiddleware(
  options: RateLimiterOptions,
  key: string
) {
  const buckets: { [key: string]: TokenBucket } = {};

  return (
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

    if (!bucket.consume()) {
      res.status(429).send(ResponseEntity.tooManyRequests("Too many requests"));
    } else {
      next();
    }
  };
}