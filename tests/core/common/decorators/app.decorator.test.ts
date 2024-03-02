import { App } from "@core/common/decorators/app.decorator";
import { AppConfiguration } from "@core/common/interfaces/app-configuration.interface";

describe("App", () => {
  it("should add appConfig to the target class prototype", () => {
    const mockConfig: AppConfiguration = {
      middleware: [],
      errorMiddleware: [],
      port: 3000,
    };
    class MockClass {
      start() {}
    }

    App(mockConfig)(MockClass);

    /* @ts-ignore */
    expect(MockClass.prototype.appConfig).toBe(mockConfig);
  });
});
