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
      setHeader: jest.fn(),
    };
    next = jest.fn();
    options = {
      tokensPerSecond: 1,
      bucketSize: 1,
    };
    tokenBucket = {
      consume: jest.fn(),
      availableTokens: jest.fn(),
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

  it("should set correct headers on every request", () => {
    tokenBucket.consume = jest.fn().mockReturnValue(true);
    tokenBucket.availableTokens = jest.fn().mockReturnValue(10);
    tokenBucket.limit = jest.fn().mockReturnValue(10);
    tokenBucket.timeToNextRefill = jest.fn().mockReturnValue(1);

    const middleware = createRateLimiterMiddleware(options, "test");
    middleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.setHeader).toHaveBeenCalledWith("X-Ratelimit-Remaining", "10");
    expect(res.setHeader).toHaveBeenCalledWith("X-Ratelimit-Limit", "10");
    expect(res.setHeader).toHaveBeenCalledWith("X-Ratelimit-Retry-After", "1");
    expect(next).toHaveBeenCalled();
  });

  it("should handle multiple requests and rate limit correctly", () => {
    jest.useFakeTimers();
    tokenBucket.consume = jest.fn().mockImplementation(() => {
      /* @ts-ignore */
      const tokens = tokenBucket.availableTokens();
      if (tokens > 0) {
        tokenBucket.availableTokens = jest.fn().mockReturnValue(tokens - 1);
        return true;
      }
      return false;
    });
    tokenBucket.availableTokens = jest.fn().mockReturnValue(10);
    tokenBucket.limit = jest.fn().mockReturnValue(10);
    tokenBucket.timeToNextRefill = jest.fn().mockReturnValue(1);

    const middleware = createRateLimiterMiddleware(options, "test");

    // Send 11 requests
    for (let i = 0; i < 11; i++) {
      middleware(req as MetaRouteRequest, res as MetaRouteResponse, next);
    }

    // Check that we hit the rate limit
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalled();

    // Advance timers by 1 second
    jest.advanceTimersByTime(1000);

    // Send another request
    middleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    // Check that the rate limit has been reset
    expect(res.setHeader).toHaveBeenCalledWith("X-Ratelimit-Remaining", "9");
    expect(res.setHeader).toHaveBeenCalledWith("X-Ratelimit-Limit", "10");
    expect(res.setHeader).toHaveBeenCalledWith("X-Ratelimit-Retry-After", "1");
    expect(next).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
