import { RATE_LIMITER_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { RateLimiterOptions } from "../../common/interfaces/rate-limiter.interface";

export function RateLimit(options: RateLimiterOptions): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      RATE_LIMITER_METADATA_KEY,
      options,
      target,
      propertyKey
    );
  };
}
