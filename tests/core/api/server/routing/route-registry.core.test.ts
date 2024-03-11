import { HttpMethod } from "@api/enums";
import { RouteRegistry } from "@api/server/routing/route-registry.core";

describe("RouteRegistry", () => {
  let routeRegistry: RouteRegistry;

  beforeEach(() => {
    routeRegistry = new RouteRegistry();
  });

  describe("register", () => {
    it("should register a route", () => {
      const handler = jest.fn();
      routeRegistry.register(HttpMethod.GET, "/test", handler);
      const route = routeRegistry.getRoute(HttpMethod.GET, "/test");
      expect(route.route?.handler).toBe(handler);
    });
  });

  describe("getRoute", () => {
    it("should return undefined if no route matches", () => {
      const route = routeRegistry.getRoute(HttpMethod.GET, "/nonexistent");
      expect(route.route).toBeUndefined();
    });

    it("should return the correct route if it matches", () => {
      const handler = jest.fn();
      routeRegistry.register(HttpMethod.GET, "/test", handler);
      const route = routeRegistry.getRoute(HttpMethod.GET, "/test");
      expect(route.route?.handler).toBe(handler);
    });

    it("should return the correct path parameters", () => {
      const handler = jest.fn();
      routeRegistry.register(HttpMethod.GET, "/test/:id", handler);
      const route = routeRegistry.getRoute(HttpMethod.GET, "/test/123");
      expect(route.pathParams).toEqual({ id: "123" });
    });

    it("should return the correct query parameters", () => {
      const handler = jest.fn();
      routeRegistry.register(HttpMethod.GET, "/test", handler);
      const route = routeRegistry.getRoute(HttpMethod.GET, "/test?id=123");
      expect(route.queryParams).toEqual({ id: "123" });
    });

    it("should return null if a static part of the route does not match the path", () => {
      const handler = jest.fn();
      routeRegistry.register(HttpMethod.GET, "/test/static", handler);
      const route = routeRegistry.getRoute(HttpMethod.GET, "/test/dynamic");
      expect(route.pathParams).toEqual({});
    });
  });
});
