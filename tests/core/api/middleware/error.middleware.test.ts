import {
  ConsoleLogger,
  LogErrorMiddleware,
  MetaRoute,
  MetaRouteRequest,
  MetaRouteResponse,
} from "src";

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
    logger = MetaRoute.resolve(ConsoleLogger);
  });

  it("should log the error and call next", () => {
    const error = new Error("Test error");

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    LogErrorMiddleware(
      error,
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(res.on).toHaveBeenCalledWith("finish", expect.any(Function));

    const finishCallback = res.on.mock.calls[0][1];
    finishCallback();

    const logMessage = `[${req.method}] ${req.url} - ${res.statusCode} - Error: ${error.message}`;

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(logMessage)
    );
    expect(next).toHaveBeenCalled();

    // Clean up the spy
    consoleSpy.mockRestore();
  });
});
