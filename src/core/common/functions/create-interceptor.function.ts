import { MetaRouteRequest } from "../../api/server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../../api/server/interfaces/meta-route.response";
import { CheckFunction, GuardFunction } from "../../api/types";

function isMetaRouteRequest(arg: any): arg is MetaRouteRequest {
  return arg?.headers && typeof arg?.parseCookies === "function";
}

function isMetaRouteResponse(arg: any): arg is MetaRouteResponse {
  return typeof arg?.status === "number";
}

function extractReqRes(
  args: any[]
): [MetaRouteRequest | undefined, MetaRouteResponse | undefined] {
  let req = args.find(isMetaRouteRequest);
  let res = args.find(isMetaRouteResponse);

  return [req, res];
}

export function createInterceptor(check: CheckFunction): GuardFunction {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [req, res] = extractReqRes(args);

      const result = await check(target, propertyKey, descriptor, req, res);
      if (result) {
        return result;
      }

      return originalMethod.apply(this, args);
    };
  };
}
