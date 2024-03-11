import { LoggingMiddleware } from "@core/api/middleware/logging.middleware";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { ConsoleLogger } from "@core/common/services/console-logger.service";

jest.mock("@core/common/services/console-logger.service");

describe("LoggingMiddleware", () => {
  let req: Partial<MetaRouteRequest>;
  let res: Partial<MetaRouteResponse> & { on: jest.Mock };
  let next: jest.Mock;
  let logger: ConsoleLogger;

  beforeEach(() => {
    req = {
      method: "GET",
      url: "/test",
    };
    res = {
      on: jest.fn(),
      statusCode: 200,
    };
    next = jest.fn();
    logger = new ConsoleLogger("HTTP");
    logger.success = jest.fn();
    logger.warn = jest.fn();

    (ConsoleLogger as jest.Mock).mockReturnValue(logger);
  });

  it("should log the request and call next", () => {
    LoggingMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.on).toHaveBeenCalledWith("finish", expect.any(Function));

    const finishCallback = res.on.mock.calls[0][1];
    finishCallback();

    const logMessage = `[${req.method}] - ${req.url} - ${res.statusCode}`;
    expect(logger.success).toHaveBeenCalledWith(logMessage);
    expect(next).toHaveBeenCalled();
  });

  it("should warn if status code is not successful", () => {
    res.statusCode = 400;

    LoggingMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    const finishCallback = res.on.mock.calls[0][1];
    finishCallback();

    const logMessage = `[${req.method}] - ${req.url} - ${res.statusCode}`;
    expect(logger.warn).toHaveBeenCalledWith(logMessage);
  });
});
