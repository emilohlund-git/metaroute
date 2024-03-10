import path from "path";
import { MetaRouteRequest } from "../server/interfaces/meta-route.request";
import { MetaRouteResponse } from "../server/interfaces/meta-route.response";
import fs from "fs";
import { NextFunction } from "../types";

export async function StaticFileMiddleware(
  req: MetaRouteRequest,
  res: MetaRouteResponse,
  next: NextFunction
) {
  if (req.method === "GET" && req.url.startsWith("/static")) {
    let filePath = path.join(
      process.cwd(),
      req.url.replace("/static", "/public")
    );

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      let contentType = "text/plain";

      if (ext === ".html") {
        contentType = "text/html";
      } else if (ext === ".css") {
        contentType = "text/css";
      } else if (ext === ".js") {
        contentType = "application/javascript";
      }

      const fileContent = fs.readFileSync(filePath);
      res.setHeader("Content-Type", contentType);
      return res.status(200).end(fileContent);
    } else {
      return res.status(404).send("Not found");
    }
  } else {
    await next();
  }
}
