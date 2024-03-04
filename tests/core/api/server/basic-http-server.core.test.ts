import { mock, instance, verify, when, anything } from "ts-mockito";
import * as http from "http";
import * as https from "https";
import {
  AppConfiguration,
  HttpMethod,
  MetaRouteRouter,
  MetaRouteServer,
  MiddlewareHandler,
  RouteRegistry,
  createMetaRouteRequest,
  createMetaRouteResponse,
} from "src";
import { EventEmitter } from "events";

jest.mock("https", () => ({
  createServer: jest.fn().mockReturnValue({
    listen: jest.fn(),
  }),
}));

jest.mock("http", () => ({
  createServer: jest.fn().mockReturnValue({
    listen: jest.fn((port, callback) => callback({}, {})), // Mock listen to call callback with two empty objects
    close: jest.fn(),
  }),
}));

describe("MetaRouteServer", () => {
  let routeRegistry: RouteRegistry;
  let router: MetaRouteRouter;
  let server: MetaRouteServer;
  let appConfig: AppConfiguration;
  let mockServer: EventEmitter & { listen: jest.Mock };

  beforeEach(() => {
    const middlewareHandler = new MiddlewareHandler();
    routeRegistry = new RouteRegistry();
    router = new MetaRouteRouter(routeRegistry, middlewareHandler);
    server = new MetaRouteServer(router);
    appConfig = {
      engine: undefined,
      ssl: undefined,
    };
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
});
