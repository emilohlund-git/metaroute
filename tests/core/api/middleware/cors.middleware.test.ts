import { HttpMethod } from "@core/api/enums/http.method";
import { CorsMiddleware } from "@core/api/middleware/cors.middleware";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { MetaRoute } from "@core/common/meta-route.container";
import { ConfigService } from "@core/common/services/config.service";

jest.mock("@core/common/meta-route.container");

describe("CorsMiddleware", () => {
  let req: Partial<MetaRouteRequest>;
  let res: Partial<MetaRouteResponse> & { headers: any };
  let next: jest.Mock;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    req = {
      method: "GET",
      headers: {
        origin: "http://example.com",
      },
    };
    res = {
      headers: {},
      setHeader: jest.fn(),
      status: jest.fn(),
    };
    next = jest.fn();
    configService = {
      get: jest.fn().mockReturnValue("http://example.com"),
    };

    (MetaRoute.get as jest.Mock).mockReturnValue(configService);
  });

  it("should set CORS headers", () => {
    CorsMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Origin",
      "http://example.com"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,OPTIONS"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Credentials",
      "true"
    );
  });

  it("should call next function for non-OPTIONS requests", () => {
    CorsMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(next).toHaveBeenCalled();
  });

  it("should send 200 status for OPTIONS requests", () => {
    req.method = HttpMethod.OPTIONS;

    CorsMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should fail if CORS headers are not set correctly", () => {
    CorsMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Access-Control-Allow-Origin",
      "http://wrong-origin.com"
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Access-Control-Allow-Methods",
      "WRONG,METHODS"
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Access-Control-Allow-Headers",
      "Wrong-Headers"
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Access-Control-Allow-Credentials",
      "false"
    );
  });

  it("should fail if next function is called for OPTIONS requests", () => {
    req.method = HttpMethod.OPTIONS;

    CorsMiddleware(req as MetaRouteRequest, res as MetaRouteResponse, next);

    expect(next).not.toHaveBeenCalled();
  });
});
