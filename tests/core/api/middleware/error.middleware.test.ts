import { ConsoleLogger, LogErrorMiddleware, MetaRouteRequest, MetaRouteResponse } from "src";

jest.mock("@core/common/services/console-logger.service");

describe("ErrorMiddleware", () => {
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
      statusCode: 500,
    };
    next = jest.fn();
    logger = new ConsoleLogger("HTTP");
    logger.error = jest.fn();

    (ConsoleLogger as jest.Mock).mockReturnValue(logger);
  });

  it("should log the error and call next", () => {
    const error = new Error("Test error");

    LogErrorMiddleware(error, req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.on).toHaveBeenCalledWith("finish", expect.any(Function));

    const finishCallback = res.on.mock.calls[0][1];
    finishCallback();

    const logMessage = `[${req.method}] ${req.url} - ${res.statusCode} - Error: ${error.message}`;
    expect(logger.error).toHaveBeenCalledWith(logMessage);
    expect(next).toHaveBeenCalled();
  });
});
