import { ServerResponse } from "http";
import { MetaRouteResponse } from "../interfaces/meta-route.response";
import fs from "fs";
import { HttpStatus } from "../../../api/enums/http.status";
import path from "path";
import { Engine } from "../../../engine/engine.abstract";

export function createMetaRouteResponses(res: ServerResponse) {
  const metaRouteResponse = res as MetaRouteResponse;

  metaRouteResponse.status = function (code: number) {
    this.statusCode = code;
    return this;
  };

  metaRouteResponse.send = function (data?: any) {
    if (typeof data === "object" && data.template && data.data) {
      return this.render(data.template, data.data);
    }

    if (!this.getHeader("Content-Type")) {
      this.setHeader("Content-Type", "application/json");
    }

    this.end(JSON.stringify(data));

    return this;
  };

  metaRouteResponse.engine = function (engine: Engine) {
    this.templateEngine = engine;
    return this;
  };

  metaRouteResponse.render = function (template: string, data: object) {
    if (!this.templateEngine) return this.send("Template engine not set");
    const html = this.templateEngine.render(template, data);
    this.setHeader("Content-Type", "text/html");
    this.status(200).end(html);
    return this;
  };

  metaRouteResponse.sendFile = function (filePath?: any) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        this.status(404).send({
          status: HttpStatus.NOT_FOUND,
          message: "Resource not found",
        });
        return;
      }

      const ext = path.extname(filePath);
      let contentType = "text/plain";
      if (ext === ".html") {
        contentType = "text/html";
      } else if (ext === ".css") {
        contentType = "text/css";
      } else if (ext === ".js") {
        contentType = "application/javascript";
      }

      this.setHeader("Content-Type", contentType);
      this.status(200).end(data);
    });

    return this;
  };

  metaRouteResponse.json = function (data: any) {
    this.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));

    return this;
  };

  metaRouteResponse.set = function (field: string, value: string) {
    this.setHeader(field, value);
    return this;
  };

  metaRouteResponse.redirect = function (url: string): void {
    this.statusCode = 302;
    this.setHeader("Location", url);
    this.end();
  };

  metaRouteResponse.options = function (allowedMethods: string[]) {
    this.status(200);
    this.setHeader("Allow", allowedMethods.join(", "));
    this.send();
    return this;
  };

  metaRouteResponse.cookie = function (
    name: string,
    value: string,
    options?: any
  ): void {
    let cookie = `${name}=${value}`;
    if (options) {
      if (options.maxAge) {
        cookie += `; Max-Age=${options.maxAge}`;
      }
      if (options.expires) {
        cookie += `; Expires=${options.expires.toUTCString()}`;
      }
      if (options.httpOnly) {
        cookie += `; HttpOnly`;
      }
      if (options.path) {
        cookie += `; Path=${options.path}`;
      }
      if (options.domain) {
        cookie += `; Domain=${options.domain}`;
      }
      if (options.secure) {
        cookie += `; Secure`;
      }
      if (options.sameSite) {
        cookie += `; SameSite=${options.sameSite}`;
      }
    }
    this.setHeader("Set-Cookie", cookie);
  };

  return metaRouteResponse;
}
