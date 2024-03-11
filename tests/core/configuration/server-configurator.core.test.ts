import { EventRouter, MetaRouteSocketServer } from "@core/api";
import { MetaRouteServer } from "@core/api/server/basic-http-server.core";
import { MetaRouteRouter } from "@core/api/server/routing/basic-http.router.core";
import { ControllerHandler } from "@core/api/server/routing/controller-handler.core";
import { ConsoleLogger } from "@core/common";
import { ConfigService } from "@core/common/services/config.service";
import { AppConfiguration, ServerConfigurator } from "@core/configuration";
import { mock } from "ts-mockito";

describe("ServerConfigurator", () => {
  let serverConfigurator: ServerConfigurator;
  let configService: ConfigService;
  let httpRouter: ControllerHandler<any>;
  let eventRouter: EventRouter<any>;
  let server: MetaRouteServer;
  let appConfiguration: AppConfiguration;
  let webSocketServer: MetaRouteSocketServer;
  let metaRouteRouter: MetaRouteRouter;
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger("TEST");
    configService = mock(ConfigService);
    httpRouter = mock(ControllerHandler);
    eventRouter = mock(EventRouter);
    metaRouteRouter = mock(MetaRouteRouter);
    webSocketServer = mock(MetaRouteSocketServer);
    server = new MetaRouteServer(metaRouteRouter, webSocketServer);
    serverConfigurator = new ServerConfigurator(
      configService,
      httpRouter,
      eventRouter,
      server,
      webSocketServer,
      logger
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

    expect(spyRegisterMiddlewares).toHaveBeenCalledTimes(2);
    expect(spyRegisterRoutes).toHaveBeenCalled();
    expect(spyStartServer).toHaveBeenCalled();
  });
});
