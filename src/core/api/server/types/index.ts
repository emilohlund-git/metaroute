import { MetaRouteRequest } from "../interfaces/meta-route.request";
import { MetaRouteResponse } from "../interfaces/meta-route.response";

export type ErrorMiddleware = (
  err: any,
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: () => void
) => void;

export type Middleware = (
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: () => void
) => void;

export type RequestHandler = (
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: () => void
) => void;

export type UnifiedMiddleware = (
  errOrReq: any | MetaRouteRequest,
  reqOrRes: MetaRouteRequest | MetaRouteResponse,
  resOrNext: MetaRouteResponse | (() => void),
  next?: () => void
) => void;

export type Route = {
  handler: RequestHandler;
  middleware: Middleware[] | ErrorMiddleware[];
};

export type NextFunction = (err?: any) => void;
