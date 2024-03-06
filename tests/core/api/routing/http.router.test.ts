import { Controller } from "@core/api/decorators/controller.decorator";
import {
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from "@core/api/decorators/handlers.decorator";
import { ResponseEntity } from "@core/api/entities/response.entity";
import { MetaRouteServer } from "@core/api/server/basic-http-server.core";
import { MetaRouteRequest } from "@core/api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "@core/api/server/interfaces/meta-route.response";
import { MiddlewareHandler } from "@core/api/server/middleware-handler.core";
import { MetaRouteRouter } from "@core/api/server/routing/basic-http.router.core";
import { ControllerHandler } from "@core/api/server/routing/controller-handler.core";
import { RouteRegistry } from "@core/api/server/routing/route-registry.core";
import "reflect-metadata";
import { ConsoleLogger } from "src";

import { mock, instance } from "ts-mockito";

@Controller("test")
class MockController extends Function {
  @Get("")
  testMethod(req: MetaRouteRequest, res: MetaRouteResponse) {
    return ResponseEntity.ok();
  }

  @Post("/tester")
  testMethod2(req: MetaRouteRequest, res: MetaRouteResponse) {
    return ResponseEntity.ok();
  }

  @Delete("/tester2")
  testMethod3(req: MetaRouteRequest, res: MetaRouteResponse) {
    return ResponseEntity.ok();
  }

  @Patch("/tester3")
  testMethod4(req: MetaRouteRequest, res: MetaRouteResponse) {
    return ResponseEntity.ok();
  }

  @Put("/tester4")
  testMethod5(req: MetaRouteRequest, res: MetaRouteResponse) {
    return ResponseEntity.ok();
  }
}

describe("HttpRouter", () => {
  let app: MetaRouteServer;
  let controller: MockController;
  let router: ControllerHandler<MockController>;
  let basicRouter: MetaRouteRouter;
  let registry: RouteRegistry;
  let middlewareHandler: MiddlewareHandler;
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger("TEST");
    controller = new MockController();
    router = new ControllerHandler(logger);
    registry = new RouteRegistry();
    middlewareHandler = new MiddlewareHandler(logger);
    basicRouter = new MetaRouteRouter(registry, middlewareHandler);
    app = new MetaRouteServer(basicRouter);
  });

  it("should register a controller", () => {
    const spy = jest.spyOn(app, "get");
    router.register(app, controller);

    expect(spy).toHaveBeenCalled();
  });

  it("should create a handler", () => {
    const handler = router["createHandler"](controller, "testMethod");
    expect(typeof handler).toBe("function");
  });

  it("should build arguments for a handler", () => {
    const req = mock<MetaRouteRequest>();
    const res = mock<MetaRouteResponse>();
    const args = router["buildArgs"](
      controller,
      "testMethod",
      instance(req),
      instance(res)
    );
    expect(Array.isArray(args)).toBe(true);
  });

  it("should register the correct path for each method", () => {
    const getSpy = jest.spyOn(app, "get");
    const postSpy = jest.spyOn(app, "post");
    const deleteSpy = jest.spyOn(app, "delete");
    const patchSpy = jest.spyOn(app, "patch");
    const putSpy = jest.spyOn(app, "put");

    router.register(app, controller);

    expect(getSpy).toHaveBeenCalledWith(
      "test",
      expect.any(Function),
      undefined
    );
    expect(postSpy).toHaveBeenCalledWith(
      "test/tester",
      expect.any(Function),
      undefined
    );
    expect(deleteSpy).toHaveBeenCalledWith(
      "test/tester2",
      expect.any(Function),
      undefined
    );
    expect(patchSpy).toHaveBeenCalledWith(
      "test/tester3",
      expect.any(Function),
      undefined
    );
    expect(putSpy).toHaveBeenCalledWith(
      "test/tester4",
      expect.any(Function),
      undefined
    );
  });

  it("should handle errors in createHandler", async () => {
    const handler = router["createHandler"](controller, "testMethod");
    const req = mock<MetaRouteRequest>();
    const res = mock<MetaRouteResponse>();
    const next = jest.fn();
    controller.testMethod = jest
      .fn()
      .mockRejectedValue(new Error("Test error"));
    await handler(instance(req), instance(res), next);
    expect(next).toHaveBeenCalledWith(new Error("Test error"));
  });
});
