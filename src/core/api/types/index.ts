import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { ResponseEntity } from "../entities/response.entity";

export type NextFunction = (err?: any) => Promise<void>;

export type ErrorMiddleware = (
  err: any,
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) => Promise<void>;

export type Middleware = (
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) => Promise<void>;

export type RequestHandler = (
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) => Promise<void>;

export type UnifiedMiddleware = (
  errOrReq: Error | MetaRouteRequest,
  reqOrRes: MetaRouteRequest | MetaRouteResponse,
  resOrNext: MetaRouteResponse | NextFunction,
  next?: NextFunction
) => Promise<void>;

export type Route = {
  handler: RequestHandler;
  middleware: Middleware[] | ErrorMiddleware[];
};

export type CheckFunction = (
  req: MetaRouteRequest,
  res: MetaRouteResponse
) => Promise<any>;
export type MetaApiResponse<T> = Promise<ResponseEntity<T>>;
export type GuardFunction = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void;
export type Guard = (prop?: any) => GuardFunction;
export type JwtHeaders = Headers & {
  authorization?: string;
};
export type JwtRequest<T> = Request & {
  headers: JwtHeaders;
  user?: Partial<T>;
};
export type HttpHeaders = {
  [key: string]: string;
};
