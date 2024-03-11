import { MetaRouteRequest, MetaRouteResponse } from "../../api";
import { MetaRouteException } from "../../common/exceptions";

function isMetaRouteRequest(arg: any): arg is MetaRouteRequest {
  return arg.headers && typeof arg.parseCookies === "function";
}

function isMetaRouteResponse(arg: any): arg is MetaRouteResponse {
  return typeof arg.status === "function";
}

function extractReqRes(args: any[]): [MetaRouteRequest, MetaRouteResponse] {
  let req = args.find(isMetaRouteRequest)!;
  let res = args.find(isMetaRouteResponse)!;

  if (!req || !res) {
    throw new MetaRouteException("Request or Response not found");
  }

  return [req, res];
}

export function createDecorator(
  logic: (
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    originalMethod: Function,
    args: any[]
  ) => Promise<any>
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res] = extractReqRes(args);
      return await logic(req, res, originalMethod, args);
    };
    return descriptor;
  };
}
