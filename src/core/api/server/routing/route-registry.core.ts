import { Injectable } from "../../../common/decorators/injectable.decorator";
import { Middleware, RequestHandler, Route } from "../types";
import { HttpMethod } from "../../enums/http.method";

@Injectable
export class RouteRegistry {
  private routes: Record<string, Record<string, Route>> = {};

  constructor() {}

  register(
    method: HttpMethod,
    path: string,
    handler: RequestHandler,
    middleware: Middleware[] = []
  ) {
    if (!this.routes[method]) {
      this.routes[method] = {};
    }

    this.routes[method][path] = { handler, middleware };
  }

  getRoute(
    method: HttpMethod,
    path: string,
    host?: string
  ): {
    route: Route | undefined;
    pathParams: Record<string, string>;
    queryParams: Record<string, string>;
  } {
    console.log("method", method)
    console.log("path", path)
    console.log("host", host)
    const url = new URL(path, `http://${host}`);
    const pathParts = this.getPathParts(url);
    const queryParams = this.getQueryParams(url);

    let matchedRoute: Route | undefined;
    let matchedPathParams: Record<string, string> = {};

    for (const route in this.routes[method]) {
      const routeParts = route.split("/").filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;

      const pathParams = this.getPathParams(routeParts, pathParts);
      if (pathParams) {
        if (matchedRoute && !route.includes(":")) continue;

        if (!route.includes(":") || !matchedRoute) {
          matchedRoute = this.routes[method][route];
          matchedPathParams = pathParams;
        }

        if (!route.includes(":")) break;
      }
    }

    return { route: matchedRoute, pathParams: matchedPathParams, queryParams };
  }

  private getPathParts(url: URL): string[] {
    return url.pathname.split("/").filter(Boolean);
  }

  private getQueryParams(url: URL): Record<string, string> {
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    return queryParams;
  }

  private getPathParams(
    routeParts: string[],
    pathParts: string[]
  ): Record<string, string> | null {
    const pathParams: Record<string, string> = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        pathParams[routeParts[i].substring(1)] = pathParts[i];
        continue;
      }
      if (routeParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return pathParams;
  }
}
