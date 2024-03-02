import { createInterceptor } from "@core/common/functions/create-interceptor.function";
import { Server } from "socket.io";

describe("createInterceptor", () => {
  it("should call the original method if check function returns falsy", async () => {
    const originalMethod = jest.fn();
    const check = jest.fn().mockResolvedValue(false);
    const descriptor = { value: originalMethod };
    const interceptor = createInterceptor(check);
    interceptor({}, "test", descriptor);
    await descriptor.value(["req", "res", new Server()]);
    expect(originalMethod).toHaveBeenCalled();
  });

  it("should not call the original method if check function returns truthy", async () => {
    const originalMethod = jest.fn();
    const check = jest.fn().mockResolvedValue(true);
    const descriptor = { value: originalMethod };
    const interceptor = createInterceptor(check);
    interceptor({}, "test", descriptor);
    const result = await descriptor.value(["req", "res", new Server()]);
    expect(originalMethod).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
