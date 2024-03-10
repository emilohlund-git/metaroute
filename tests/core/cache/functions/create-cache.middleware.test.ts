import { createCacheMiddleware } from "@core/cache/functions/create-cache-middleware";
import { CacheOptions } from "@core/cache/interfaces/cache-options.interface";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { NextFunction } from "src";

jest.mock("@core/cache/services/cache.service", () => {
  let cache: number | null = null;
  return {
    CacheService: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockImplementation((key) => {
          return key === "test" ? cache : null;
        }),
        set: jest.fn().mockImplementation((key, value) => {
          if (key === "test") {
            cache = value;
          }
        }),
      };
    }),
  };
});

describe("createCacheMiddleware", () => {
  let options: CacheOptions;
  let key: string;
  let req: MetaRouteRequest;
  let res: MetaRouteResponse;
  let next: NextFunction;

  beforeEach(() => {
    options = { ttl: 60 };
    key = "test";
    req = { ip: "127.0.0.1" } as MetaRouteRequest;
    res = {
      send: jest.fn(),
      setHeader: jest.fn(),
    } as unknown as MetaRouteResponse;
    next = jest.fn();
  });

  it("should call next if no user IP", async () => {
    req.ip = undefined;
    const middleware = await createCacheMiddleware(options, key);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should create new cache and set X-Cache to MISS if no cache exists", async () => {
    const middleware = await createCacheMiddleware(options, key);
    middleware(req, res, next);
    res.send("response body");
    expect(res.setHeader).toHaveBeenCalledWith("X-Cache", "MISS");
  });

  it("should return cached response and set X-Cache to HIT if cache exists", async () => {
    const middleware = await createCacheMiddleware(options, key);
    middleware(req, res, next);
    res.send("response body");
    expect(res.setHeader).toHaveBeenCalledWith("X-Cache", "HIT");
    expect(res.send).toHaveBeenCalledTimes(2);
  });
});
