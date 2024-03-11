import { ResponseEntity } from "@core/api/entities/response.entity";
import { ApiKey } from "@core/api/guards/api-key.guard";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";

describe("ApiKey Guard", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      headers: {},
      parseCookies: () => ({}),
    };
    res = {
      status: (num: number) => res,
    };
    process.env.API_KEY = "test";
  });

  it("should return unauthorized if no API key is provided", async () => {
    req.headers["x-api-key"] = undefined;

    const mockObject = {
      mockMethod: async (_req: any, _res: any) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = ApiKey();
    guard(mockObject, "mockMethod", descriptor);

    // Replace the original method with the decorated method
    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);
    expect(result).toEqual(ResponseEntity.unauthorized());
  });

  it("should pass if the correct API key is provided", async () => {
    req.headers["x-api-key"] = process.env.API_KEY;

    const mockObject = {
      mockMethod: async (_req: MetaRouteRequest, _res: MetaRouteResponse) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = ApiKey();
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);

    expect(result).toBeUndefined();
  });
});
