import { ResponseEntity } from "@core/api/entities/response.entity";
import { VerifiedEmailGuard } from "@core/api/guards/email.guard";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";

describe("VerifiedEmail Guard", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: {},
      parseCookies: () => ({}),
      headers: {},
    };
    res = {
      status: (value: any) => res,
    };
  });

  it("should return forbidden if user is not verified", async () => {
    req.user.verified = false;

    const mockObject = {
      mockMethod: async (_req: any, _res: any) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = VerifiedEmailGuard();
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);
    expect(result).toEqual(ResponseEntity.forbidden());
  });

  it("should pass if the user is verified", async () => {
    req.user.verified = true;

    const mockObject = {
      mockMethod: async (_req: MetaRouteRequest, _res: MetaRouteResponse) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = VerifiedEmailGuard();
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);

    expect(result).toBeUndefined();
  });
});
