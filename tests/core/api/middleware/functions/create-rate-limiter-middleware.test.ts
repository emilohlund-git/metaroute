import { createRateLimiterMiddleware } from "@core/api/middleware/functions/create-rate-limiter-middleware";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { TokenBucket } from "@core/api/services/token-bucket.service";
import { RateLimiterOptions } from "@core/common/interfaces/rate-limiter.interface";

jest.mock("@core/api/services/token-bucket.service");

describe("createRateLimiterMiddleware", () => {
  let req: Partial<MetaRouteRequest>;
  let res: Partial<MetaRouteResponse> & { status: jest.Mock; send: jest.Mock };
  let next: jest.Mock;
  let options: RateLimiterOptions;
  let tokenBucket: Partial<TokenBucket>;

  beforeEach(() => {
    req = {
      ip: "127.0.0.1",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    options = {
      tokensPerSecond: 1,
      bucketSize: 1,
    };
    tokenBucket = {
      consume: jest.fn(),
    };

    (TokenBucket as jest.Mock).mockReturnValue(tokenBucket);
  });

  it("should call next if no user IP", () => {
    req.ip = undefined;

    const middleware = createRateLimiterMiddleware(options, "test");
    middleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(next).toHaveBeenCalled();
  });

  it("should call next if bucket can consume", () => {
    tokenBucket.consume = jest.fn().mockReturnValue(true);

    const middleware = createRateLimiterMiddleware(options, "test");
    middleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(next).toHaveBeenCalled();
  });

  it("should send 429 status if bucket cannot consume", () => {
    tokenBucket.consume = jest.fn().mockReturnValue(false);

    const middleware = createRateLimiterMiddleware(options, "test");
    middleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalled();
  });
});
