import {
  HttpStatus,
  JsonMiddleware,
  MetaRouteRequest,
  MetaRouteResponse,
  NextFunction,
} from "src";

describe("JsonMiddleware", () => {
  let req: Partial<MetaRouteRequest>;
  let res: Partial<MetaRouteResponse>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      method: "",
      on: function (
        this: MetaRouteRequest,
        event: string,
        callback: (...args: any[]) => void
      ) {
        if (event === "data") callback('{"key":"value"}');
        if (event === "end") callback();
        return this;
      } as any,
    };
    res = {
      statusCode: 200,
      end: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("should parse JSON body for non-GET requests with application/json content-type", () => {
    req.headers!["content-type"] = "application/json";
    req.method = "POST";

    JsonMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(req.body).toEqual({ key: "value" });
    expect(next).toHaveBeenCalled();
  });

  it("should send 400 response for invalid JSON", () => {
    req.headers!["content-type"] = "application/json";
    req.method = "POST";
    req.on = function (
      this: MetaRouteRequest,
      event: string,
      callback: (...args: any[]) => void
    ) {
      if (event === "data") callback("invalid json");
      if (event === "end") callback();
      return this;
    } as any;

    JsonMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.statusCode).toBe(400);
    expect(res.send).toHaveBeenCalledWith({
      status: HttpStatus.BAD_REQUEST,
      message: "Invalid JSON",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next for GET requests", () => {
    req.headers!["content-type"] = "application/json";
    req.method = "GET";

    JsonMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(next).toHaveBeenCalled();
  });

  it("should call next for non-JSON content types", () => {
    req.headers!["content-type"] = "text/plain";
    req.method = "POST";

    JsonMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(next).toHaveBeenCalled();
  });
});
