import { MetaRouteServer } from "@core/api/server/basic-http-server.core";
import { MetaRouteRouter } from "@core/api/server/routing/basic-http.router.core";
import { EventRouter } from "@core/api/server/routing/event.router";
import { HttpRouter } from "@core/api/server/routing/http.router";
import { AppConfiguration } from "@core/common/interfaces/app-configuration.interface";
import { Controller } from "@core/common/interfaces/controller.interface";
import { ServerConfigurator } from "@core/common/server-configurator.core";
import { ConfigService } from "@core/common/services/config.service";
import { EnvironmentStore } from "@core/common/services/environment-store.service";
import { mock } from "ts-mockito";

describe("ServerConfigurator", () => {
  let serverConfigurator: ServerConfigurator;
  let configService: ConfigService;
  let httpRouter: HttpRouter<Controller>;
  let eventRouter: EventRouter<Controller>;
  let server: MetaRouteServer;
  let appConfiguration: AppConfiguration;
  let environmentStore: EnvironmentStore;
  let metaRouteRouter: MetaRouteRouter;

  beforeEach(() => {
    process.env.ALLOWED_ORIGINS = "http://localhost:3000";
    environmentStore = mock(EnvironmentStore);
    configService = new ConfigService(environmentStore);
    httpRouter = mock(HttpRouter);
    eventRouter = mock(EventRouter);
    metaRouteRouter = mock(MetaRouteRouter);
    server = new MetaRouteServer(metaRouteRouter);
    serverConfigurator = new ServerConfigurator(
      configService,
      httpRouter,
      eventRouter,
      server
    );
    appConfiguration = {
      errorMiddleware: [],
      middleware: [],
      port: 3999,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should setup correctly", async () => {
    const spyInitializeIO = jest.spyOn(
      serverConfigurator,
      "initializeIO" as any
    );
    const spyRegisterMiddlewares = jest.spyOn(
      serverConfigurator,
      "registerMiddlewares" as any
    );
    const spyRegisterRoutes = jest.spyOn(
      serverConfigurator,
      "registerRoutes" as any
    );
    const spyStartServer = jest.spyOn(serverConfigurator, "startServer" as any);
    spyStartServer.mockImplementation(() => Promise.resolve()); // Mock the startServer method

    await serverConfigurator.setup(appConfiguration);

    expect(spyInitializeIO).toHaveBeenCalled();
    expect(spyRegisterMiddlewares).toHaveBeenCalledTimes(2);
    expect(spyRegisterRoutes).toHaveBeenCalled();
    expect(spyStartServer).toHaveBeenCalled();
  });
});
