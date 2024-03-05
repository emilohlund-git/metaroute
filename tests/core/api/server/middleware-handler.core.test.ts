import {
  ErrorMiddleware,
  MetaRouteRequest,
  MetaRouteResponse,
  Middleware,
  MiddlewareHandler,
  UnifiedMiddleware,
} from "src";

describe("MiddlewareHandler", () => {
  let middlewareHandler: MiddlewareHandler;
  let mockRequest: MetaRouteRequest;
  let mockResponse: MetaRouteResponse;
  let mockNext: jest.Mock;
  let mockMiddleware: Middleware;
  let mockErrorMiddleware: ErrorMiddleware;

  beforeEach(() => {
    middlewareHandler = new MiddlewareHandler();
    mockRequest = {} as MetaRouteRequest;
    mockResponse = {} as MetaRouteResponse;
    mockNext = jest.fn();
    mockMiddleware = jest.fn((req, res, next) => next());
    mockErrorMiddleware = jest.fn((err, req, res, next) => next());
  });

  it("should handle empty middleware list", async () => {
    await middlewareHandler.handle([], mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle middleware", async () => {
    await middlewareHandler.handle(
      [mockMiddleware],
      mockRequest,
      mockResponse,
      mockNext
    );
    expect(mockMiddleware).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      expect.any(Function)
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle error middleware", async () => {
    const error = new Error("Test error");
    await middlewareHandler.handle(
      [mockErrorMiddleware],
      mockRequest,
      mockResponse,
      mockNext,
      error
    );
    expect(mockErrorMiddleware).toHaveBeenCalledWith(
      error,
      mockRequest,
      mockResponse,
      expect.any(Function)
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it("should add middleware to global middleware list", () => {
    middlewareHandler.use(mockMiddleware as UnifiedMiddleware);
    expect(middlewareHandler.middleware).toContain(mockMiddleware);
  });

  it("should call nextMiddleware with error when middleware throws an error", async () => {
    const error = new Error("Test error");
    const throwingMiddleware = jest.fn(() => {
      throw error;
    });

    await middlewareHandler.handle(
      [throwingMiddleware],
      mockRequest,
      mockResponse,
      mockNext
    );

    expect(throwingMiddleware).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      expect.any(Function)
    );
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
