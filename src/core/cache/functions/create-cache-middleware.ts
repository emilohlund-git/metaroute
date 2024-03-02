import { NextFunction } from "../../api/server/types";
import { MetaRouteRequest } from "../../api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../../api/server/interfaces/meta-route.response";
import { CacheOptions } from "../../cache/interfaces/cache-options.interface";
import { CacheService } from "../../cache/services/cache.service";

export function createCacheMiddleware(options: CacheOptions, key: string) {
  const caches: { [key: string]: CacheService } = {};

  return (
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    next: NextFunction
  ) => {
    const user = req.ip;

    if (!user) return next();

    let cache = caches[key];
    if (!cache) {
      cache = new CacheService(options.ttl);
      caches[key] = cache;
    }

    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      res.send(cachedResponse);
    } else {
      const send = res.send;
      res.send = function (body) {
        cache.set(key, body);
        res.setHeader("X-Cache", "MISS");
        return send.call(this, body);
      };
      next();
    }
  };
}
