import { IncomingMessage } from "http";
import { MetaRouteRequest } from "../interfaces/meta-route.request";

export function createMetaRouteRequest(req: IncomingMessage) {
  const metaRouteRequest = req as MetaRouteRequest;

  metaRouteRequest.parseCookies = function (cookieHeader: string | undefined) {
    const cookies: { [key: string]: string } = {};
    if (!cookieHeader) return cookies;

    const cookieStrings = cookieHeader.split("; ");
    for (const cookieString of cookieStrings) {
      const [name, value] = cookieString.split("=");
      cookies[name] = value;
    }

    return cookies;
  };

  return metaRouteRequest;
}
