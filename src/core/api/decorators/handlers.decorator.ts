import { ROUTE_METADATA_KEY } from "../../common/constants";
import { HttpMethod } from "../enums/http.method";

const createRouteDecorator =
  (method: string) =>
  (path: string, middleware?: Function) =>
  (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      ROUTE_METADATA_KEY,
      {
        method,
        path,
        middleware: middleware?.(),
      },
      descriptor.value
    );
  };

const RouteDecorators = Object.values(HttpMethod).reduce(
  (decorators, method) => {
    decorators[method.charAt(0).toUpperCase() + method.slice(1)] =
      createRouteDecorator(method);
    return decorators;
  },
  {} as { [key: string]: ReturnType<typeof createRouteDecorator> }
);

export const { Get, Post, Put, Patch, Delete } = RouteDecorators;
