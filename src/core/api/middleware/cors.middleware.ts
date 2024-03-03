import { MetaRoute } from "../../common/meta-route.container";
import { ConfigService } from "../../common/services/config.service";
import { HttpMethod } from "../enums/http.method";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { NextFunction } from "../server/types";

export function CorsMiddleware(
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) {
  const configService = MetaRoute.get(ConfigService);
  const origin = req.headers.origin!;
  const allowedOrigins = configService.get("ALLOWED_ORIGINS").split(",");
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (HttpMethod.OPTIONS == req.method) {
    res.status(200);
  } else {
    next();
  }
}