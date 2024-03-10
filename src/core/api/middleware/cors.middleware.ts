import { MetaRoute } from "../../common/meta-route.container";
import { ConfigService } from "../../common/services/config.service";
import { HttpStatus } from "../enums";
import { HttpMethod } from "../enums/http.method";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { NextFunction } from "../types";

export async function CorsMiddleware(
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) {
  const configService = MetaRoute.get(ConfigService);
  const origin = req.headers.origin!;
  const allowedOrigins = configService.get("ALLOWED_ORIGINS");
  if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (HttpMethod.OPTIONS == req.method) {
      res.status(HttpStatus.OK);
    } else {
      next();
    }
  } else {
    res.status(HttpStatus.FORBIDDEN).send({
      success: false,
      message: "The origin is not allowed",
    });
  }
}
