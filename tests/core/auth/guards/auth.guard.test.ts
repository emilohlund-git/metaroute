import { ResponseEntity } from "@core/api/entities/response.entity";
import { Auth } from "@core/auth/guards/auth.guard";
import { JwtService } from "@core/auth/services/jwt.service";

describe("Auth Guard", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      headers: {},
      parseCookies: jest.fn(),
    };
    res = {
      status: (num: number) => res,
    };
    process.env.JWT_SECRET = "test-jwt-secret";
  });

  it("should return unauthorized if no token is provided", async () => {
    const mockObject = {
      mockMethod: async (_req: any, _res: any) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = Auth();
    guard(mockObject, "mockMethod", descriptor);

    // Replace the original method with the decorated method
    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);
    expect(result).toEqual(ResponseEntity.unauthorized());
  });

  it("should pass if the correct token is provided", async () => {
    const validToken = await JwtService.signTokenAsync(
      { userId: 1 },
      process.env.JWT_SECRET!,
      "1h"
    );
    req.headers.authorization = `Bearer ${validToken}`;

    const mockObject = {
      mockMethod: async (_req: any, _res: any) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = Auth();
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);

    expect(result).toBeUndefined();
  });

  it("should return unauthorized if the token is expired", async () => {
    const expiredToken = await JwtService.signTokenAsync(
      { userId: 1 },
      process.env.JWT_SECRET!,
      "-1s"
    );
    req.headers.authorization = `Bearer ${expiredToken}`;

    const mockObject = {
      mockMethod: async (_req: any, _res: any) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = Auth();
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);
    expect(result).toEqual(ResponseEntity.unauthorized());
  });

  it("should return forbidden if token verification throws an error", async () => {
    const invalidToken = "invalid-token";
    req.headers.authorization = `Bearer ${invalidToken}`;

    const mockObject = {
      mockMethod: async (_req: any, _res: any) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = Auth();
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(req, res);
    expect(result).toEqual(ResponseEntity.forbidden());
  });
});
