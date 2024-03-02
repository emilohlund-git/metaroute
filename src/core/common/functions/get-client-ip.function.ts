import { MetaRouteRequest } from "../../api/server/interfaces/meta-route.request";
import { IP_REGEX, KNOWN_IP_HEADERS, X_FORWARDED_FOR } from "../constants";

function isIp(ip?: string | string[] | undefined): boolean {
  if (!ip) {
    return false;
  }

  if (Array.isArray(ip)) {
    ip = ip[0];
  }

  return IP_REGEX.v4.test(ip) || IP_REGEX.v6.test(ip);
}

function getIpFromHeaders(
  headers: any,
  headerName: string
): string | undefined {
  const headerValue = headers[headerName];
  if (isIp(headerValue)) {
    return Array.isArray(headerValue) ? headerValue[0] : headerValue;
  }
  return undefined;
}

function parseXForwardedFor(
  value: string | string[] | undefined
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    value = value[0];
  }

  const forwarded = value.split(",").map((e) => {
    const ip = e.trim();
    const split = ip.split(":");
    return split.length > 1 && !ip.includes(":") ? split[0] : ip;
  });

  return forwarded.find(isIp);
}

export function getClientIp(req: MetaRouteRequest): string | undefined {
  const forwardedForIp =
    getIpFromHeaders(req.headers, X_FORWARDED_FOR) ||
    parseXForwardedFor(req.headers[X_FORWARDED_FOR]);
  if (forwardedForIp) {
    return forwardedForIp;
  }

  for (const header of KNOWN_IP_HEADERS) {
    const ip = getIpFromHeaders(req.headers, header);
    if (ip) {
      return ip;
    }
  }

  return (
    req.headers.forwarded ||
    (req.socket && isIp(req.socket.remoteAddress)
      ? req.socket.remoteAddress
      : undefined)
  );
}
