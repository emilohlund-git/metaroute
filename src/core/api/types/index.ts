import { DatabaseResponse } from "../../database/interfaces/database-response.interface";
import { ResponseEntity } from "../entities/response.entity";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";

export type CheckFunction = (
  target: Function,
  propertyKey: string,
  req?: MetaRouteRequest,
  res?: MetaRouteResponse
) => Promise<any>;
export type MetaResponse<T> = Promise<ResponseEntity<DatabaseResponse<T>>>;
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
export type JwtPayloadUser = {
  data: any;
  username: string;
  exp: number;
  iat: number;
  email: string;
};
export type HttpHeaders = {
  [key: string]: string;
};
