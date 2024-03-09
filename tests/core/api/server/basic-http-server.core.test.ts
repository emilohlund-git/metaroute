import { mock, instance } from "ts-mockito";
import * as http from "http";
import * as https from "https";
import {
  AppConfiguration,
  ConsoleLogger,
  HttpMethod,
  MetaEngine,
  MetaRouteRouter,
  MetaRouteServer,
  MetaRouteSocketServer,
  MiddlewareHandler,
  RouteRegistry,
} from "src";
import { EventEmitter } from "events";
import * as responseCreator from "src/core/api/server/functions/create-meta-route-response.function";

jest.mock("https", () => ({
  createServer: jest.fn().mockReturnValue({
    listen: jest.fn(),
    on: jest.fn(),
  }),
}));

jest.mock("http", () => ({
  createServer: jest.fn().mockReturnValue({
    listen: jest.fn((port, callback) => callback({}, {})), // Mock listen to call callback with two empty objects
    close: jest.fn(),
    on: jest.fn(),
  }),
}));

describe("MetaRouteServer", () => {
  let routeRegistry: RouteRegistry;
  let router: MetaRouteRouter;
  let server: MetaRouteServer;
  let appConfig: AppConfiguration;
  let mockServer: EventEmitter & { listen: jest.Mock };
  let logger: ConsoleLogger;
  let socketServer: MetaRouteSocketServer;

  beforeEach(() => {
    logger = new ConsoleLogger("TEST");
    const middlewareHandler = new MiddlewareHandler(logger);
    routeRegistry = new RouteRegistry();
    router = new MetaRouteRouter(routeRegistry, middlewareHandler, logger);
    socketServer = mock(MetaRouteSocketServer);
    server = new MetaRouteServer(router, socketServer);
    appConfig = {
      engine: undefined,
      ssl: undefined,
    } as AppConfiguration;
    mockServer = new EventEmitter() as any;
    mockServer.listen = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an http server and listen on given port", () => {
    const httpServer = http.createServer();
    const listenSpy = jest.spyOn(httpServer, "listen");
    server.listen(3000, appConfig, () => {});
    expect(listenSpy).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it("should create an https server and listen on given port when ssl config is provided", () => {
    const createServerSpy = jest.spyOn(https, "createServer");
    appConfig.ssl = { key: "testKey", cert: "testCert" };
    server.listen(3000, appConfig, () => {});
    expect(createServerSpy).toHaveBeenCalledWith(
      appConfig.ssl,
      expect.any(Function)
    );
    createServerSpy.mockRestore();
  });

  it("should register GET route", () => {
    const handler = jest.fn();
    const registerSpy = jest.spyOn(routeRegistry, "register");
    server.get("/test", handler);
    expect(registerSpy).toHaveBeenCalledWith(
      HttpMethod.GET,
      "/test",
      handler,
      expect.anything()
    );
  });

  it("should register POST route", () => {
    const handler = jest.fn();
    const registerSpy = jest.spyOn(routeRegistry, "register");
    server.post("/test", handler);
    expect(registerSpy).toHaveBeenCalledWith(
      HttpMethod.POST,
      "/test",
      handler,
      expect.anything()
    );
  });

  it("should register PATCH route", () => {
    const handler = jest.fn();
    const registerSpy = jest.spyOn(routeRegistry, "register");
    server.patch("/test", handler);
    expect(registerSpy).toHaveBeenCalledWith(
      HttpMethod.PATCH,
      "/test",
      handler,
      expect.anything()
    );
  });

  it("should register PUT route", () => {
    const handler = jest.fn();
    const registerSpy = jest.spyOn(routeRegistry, "register");
    server.put("/test", handler);
    expect(registerSpy).toHaveBeenCalledWith(
      HttpMethod.PUT,
      "/test",
      handler,
      expect.anything()
    );
  });

  it("should register DELETE route", () => {
    const handler = jest.fn();
    const registerSpy = jest.spyOn(routeRegistry, "register");
    server.delete("/test", handler);
    expect(registerSpy).toHaveBeenCalledWith(
      HttpMethod.DELETE,
      "/test",
      handler,
      expect.anything()
    );
  });

  it("should register OPTIONS route", () => {
    const handler = jest.fn();
    const registerSpy = jest.spyOn(routeRegistry, "register");
    server.options("/test", handler);
    expect(registerSpy).toHaveBeenCalledWith(
      HttpMethod.OPTIONS,
      "/test",
      handler,
      expect.anything()
    );
  });

  it("should register middleware", () => {
    const middleware = jest.fn();
    const registerMiddlewareSpy = jest.spyOn(router, "registerMiddleware");
    server.use(middleware);
    expect(registerMiddlewareSpy).toHaveBeenCalledWith(middleware);
  });

  it("should close the server", () => {
    const httpServer = http.createServer();
    const closeSpy = jest.spyOn(httpServer, "close");
    server.listen(3000, appConfig, () => {});
    server.close();
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should create an HTTP server and listen on the given port", () => {
    jest.spyOn(http, "createServer").mockImplementation((reqHandler: any) => {
      mockServer.on("request", reqHandler);
      return mockServer as any;
    });
    const handleRequestSpy = jest.spyOn(router, "handleRequest");

    server.listen(3000, {}, () => {});

    expect(http.createServer).toHaveBeenCalled();
    expect(mockServer.listen).toHaveBeenCalledWith(3000, expect.any(Function));

    const req = mock(http.IncomingMessage);
    req.method = "GET";
    req.url = "/test";
    req.headers = { host: "localhost:3000" };
    const res = mock(http.ServerResponse);
    mockServer.emit("request", req, instance(res));

    expect(handleRequestSpy).toHaveBeenCalled();
  });

  it("should use engine if provided in config", () => {
    const req = mock(http.IncomingMessage);
    req.method = "GET";
    req.url = "/test";
    req.headers = { host: "localhost:3000" };

    const engineSpy = jest.fn();
    const res = {
      engine: engineSpy,
      statusCode: 200,
      end: jest.fn(),
      status: jest.fn().mockReturnThis(), // Change this line
      send: jest.fn(),
    };
    jest.spyOn(http, "createServer").mockImplementation((reqHandler: any) => {
      mockServer.on("request", (req, res) => reqHandler(req, res));
      return mockServer as any;
    });

    jest
      .spyOn(responseCreator, "createMetaRouteResponse")
      .mockReturnValue(res as any);

    appConfig.engine = MetaEngine;

    server.listen(3000, appConfig, () => {});

    mockServer.emit("request", req, res);

    expect(engineSpy).toHaveBeenCalledWith(new MetaEngine());
  });
});
