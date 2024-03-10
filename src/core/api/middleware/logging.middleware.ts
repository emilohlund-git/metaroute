import { ConsoleLogger } from "../../common/services/console-logger.service";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { NextFunction } from "../types";

export async function LoggingMiddleware(
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) {
  const logger = new ConsoleLogger("HTTP");

  res.on("finish", () => {
    const logMessage = `[${req.method}] - ${req.url} - ${res.statusCode}`;
    if (res.statusCode < 400 && res.statusCode >= 200) {
      logger.success(logMessage);
    } else {
      logger.warn(logMessage);
    }
  });

  await next();
}
