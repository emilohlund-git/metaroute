import { EventRouter, MetaRouteSocketServer } from "@core/api";
import { MetaRouteServer } from "@core/api/server/basic-http-server.core";
import { MetaRouteRouter } from "@core/api/server/routing/basic-http.router.core";
import { ControllerHandler } from "@core/api/server/routing/controller-handler.core";
import { ConsoleLogger, MetaRoute } from "@core/common";
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

  it("should register routes correctly", async () => {
    const spyRegisterStrategy = jest.spyOn(
      serverConfigurator,
      "registerStrategy" as any
    );
    spyRegisterStrategy.mockImplementation(() => Promise.resolve());

    await (serverConfigurator as any).registerRoutes();

    expect(spyRegisterStrategy).toHaveBeenCalledTimes(3);
  });

  it("should register strategy correctly", async () => {
    const mockInstance = { constructor: {} };
    const mockAction = jest.fn().mockResolvedValue(undefined);
    const mockMetadataKey = Symbol("test");

    jest.spyOn(MetaRoute, "getAllInstances").mockReturnValue([mockInstance]);
    Reflect.defineMetadata(mockMetadataKey, true, mockInstance.constructor);

    await (serverConfigurator as any).registerStrategy(
      mockMetadataKey,
      mockAction
    );

    expect(mockAction).toHaveBeenCalledWith(mockInstance);
  });

  it("should start server correctly", () => {
    const mockPort = 3000;
    const mockConfig: AppConfiguration = {
      errorMiddleware: [],
      middleware: [],
      port: mockPort,
    };

    jest.spyOn(configService, "getInteger").mockReturnValue(mockPort);
    jest
      .spyOn(server, "listen")
      .mockImplementation((port, config, callback) => {
        callback();
      });
    const warnSpy = jest.spyOn(logger, "warn");
    const successSpy = jest.spyOn(logger, "success");

    (serverConfigurator as any).startServer(mockConfig);

    expect(configService.getInteger).toHaveBeenCalledWith("PORT");
    expect(server.listen).toHaveBeenCalledWith(
      mockPort,
      mockConfig,
      expect.any(Function)
    );
    expect(warnSpy).not.toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith(
      `[HTTP] - 🚀 Server running on port ${mockPort}`
    );
  });

  it("should register middlewares correctly", () => {
    const mockMiddleware = jest.fn();
    const mockErrorMiddleware = jest.fn();
    const mockMiddlewares = [mockMiddleware, mockErrorMiddleware];

    jest.spyOn(server, "use");

    (serverConfigurator as any).registerMiddlewares(mockMiddlewares);

    expect(server.use).toHaveBeenCalledTimes(mockMiddlewares.length);
    expect(server.use).toHaveBeenNthCalledWith(1, mockMiddleware);
    expect(server.use).toHaveBeenNthCalledWith(2, mockErrorMiddleware);
  });
});
