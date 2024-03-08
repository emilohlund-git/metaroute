import { App } from "@core/common/decorators/app.decorator";
import { AppConfiguration } from "@core/common/interfaces/app-configuration.interface";
import { Application } from "src";

class MockApplication extends Application {
  public start(): void {}

  public stop(): void {}
}

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

    try {
      App(mockConfig)(MockClass);
    } catch (error: any) {
      expect(error.message).toBe(
        "Class decorated with @App must extend Application"
      );
    }

    class MockClassExtended extends MockApplication {}

    App(mockConfig)(MockClassExtended);

    /* @ts-ignore */
    expect(MockClassExtended.prototype.appConfig).toBe(mockConfig);
  });
});
