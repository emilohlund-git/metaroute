import { createInterceptor } from "@core/common/functions/create-interceptor.function";
import { MetaRouteSocketServer } from "@core/api/websocket";
import { instance } from "ts-mockito";

describe("createInterceptor", () => {
  it("should call the original method if check function returns falsy", async () => {
    const originalMethod = jest.fn();
    const req = {
      headers: {},
      parseCookies: () => {},
    };
    const res = {
      status: (value: any) => res,
    };

    const check = jest.fn().mockReturnValue(false);
    const descriptor = { value: originalMethod };
    const interceptor = createInterceptor(check);
    interceptor({}, "test", descriptor);
    await descriptor.value.apply(null, [req, res]);
    expect(originalMethod).toHaveBeenCalled();
  });

  it("should not call the original method if check function returns truthy", async () => {
    const originalMethod = jest.fn();
    const req = {
      headers: {},
      parseCookies: () => {},
    };
    const res = {
      status: (value: any) => res,
    };
    const check = jest.fn().mockResolvedValue(true);
    const descriptor = { value: originalMethod };
    const interceptor = createInterceptor(check);
    interceptor({}, "test", descriptor);
    const result = await descriptor.value.apply(null, [req, res]);
    expect(originalMethod).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
