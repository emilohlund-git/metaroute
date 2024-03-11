import { CACHE_METADATA_KEY } from "../..";
import { CacheOptions } from "../interfaces/cache-options.interface";

export function Cache(options: CacheOptions): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(CACHE_METADATA_KEY, options, target, propertyKey);
  };
}
