import { HttpStatus } from "../enums";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import { NextFunction } from "../types";

export async function JsonMiddleware(
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) {
  if (
    req.headers["content-type"] === "application/json" &&
    req.method !== "GET"
  ) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        req.body = JSON.parse(data);
        next();
      } catch (e) {
        res.statusCode = 400;
        res.send({
          status: HttpStatus.BAD_REQUEST,
          message: "Invalid JSON",
        });
      }
    });
  } else {
    await next();
  }
}
