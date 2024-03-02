import { ResponseEntity } from "@core/api/entities/response.entity";
import { Validate } from "@core/validation/guards/validator.guard";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { IsEmail } from "@core/validation/decorators/email.validation";
import { IsPassword } from "@core/validation/decorators/password.validation";
import { validator } from "@core/validation/functions/validator";
import "reflect-metadata";

class MockSchema {
  @IsEmail()
  email: string;
  @IsPassword()
  password: string;
}

describe("Validate Guard", () => {
  let data: any;
  let req: MetaRouteRequest;
  let res: MetaRouteResponse;

  beforeEach(() => {
    data = {
      email: "invalid email",
      password: "password",
    };

    req = {
      headers: {},
      parseCookies: () => ({}),
      body: data,
    } as Partial<MetaRouteRequest> as MetaRouteRequest;

    res = {
      status: (num: number) => res,
    } as Partial<MetaRouteResponse> as MetaRouteResponse;
  });

  it("should return bad request if validation fails", async () => {
    data.email = "invalid email";

    const mockObject = {
      mockMethod: async (
        _target: any,
        _propertyKey: any,
        _req: MetaRouteRequest,
        _res: MetaRouteResponse
      ) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = Validate(MockSchema);
    guard(mockObject, "mockMethod", descriptor);

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(0, 0, req, res);
    const errors = validator(data, MockSchema);
    expect(result).toEqual(ResponseEntity.badRequest(errors));
  });

  it("should pass if validation succeeds", async () => {
    data.email = "valid@email.com";
    data.password = "Password$1234";

    const mockObject = {
      mockMethod: async (
        _target: any,
        _propertyKey: any,
        _req: MetaRouteRequest,
        _res: MetaRouteResponse
      ) => {},
    };

    const descriptor = {
      value: mockObject.mockMethod,
    };

    const guard = Validate(MockSchema);
    guard(mockObject, "mockMethod", descriptor);

    if (typeof descriptor.value !== "function") {
      throw new Error("Validate function did not return a callable function");
    }

    mockObject.mockMethod = descriptor.value;

    const result = await mockObject.mockMethod(null, null, req, res);

    expect(result).toBeUndefined();
  });
});
