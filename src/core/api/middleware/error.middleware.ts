import { MetaRoute } from "../../common/meta-route.container";
import { ConsoleLogger } from "../../common/services/console-logger.service";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { NextFunction } from "../types";

export async function LogErrorMiddleware(
  err: Error,
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) {
  const logger = MetaRoute.resolve(ConsoleLogger);
  logger.setContext("ErrorMiddleware");

  logger.debug("Error middleware running");

  res.on("finish", () => {
    logger.debug("Response finished");
    const logMessage = `[${req.method}] ${req.url} - ${res.statusCode} - Error: ${err.message}`;
    logger.error(logMessage);
  });

  next();
}
