import { createServer, Server } from "http";
import path from "path";
import * as fs from "fs";
import { createMetaRouteResponse } from "src";
import request from "supertest";

describe("createMetaRouteResponse", () => {
  let server: Server;

  beforeEach(() => {
    server = createServer((req, res) => {
      const metaRes = createMetaRouteResponse(res);
    });
  });

  afterEach(() => {
    server.close();
  });

  it("should set status code", async () => {
    server.on("request", (req, res) => {
      const metaRes = createMetaRouteResponse(res);
      metaRes.status(200).send("OK");
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe('"OK"');
  });

  it("should send JSON response", async () => {
    server.on("request", (req, res) => {
      const metaRes = createMetaRouteResponse(res);
      metaRes.json({ message: "Hello, World!" });
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Hello, World!" });
  });

  it("should send file", async () => {
    server.on("request", (req, res) => {
      const metaRes = createMetaRouteResponse(res);
      const filePath = path.resolve(__dirname, "test.txt");
      fs.writeFileSync(filePath, "Hello, World!");
      metaRes.sendFile(filePath);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello, World!");
  });

  it("should redirect", async () => {
    server.on("request", (req, res) => {
      const metaRes = createMetaRouteResponse(res);
      metaRes.redirect("/redirected");
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/redirected");
  });

  it("should set options", async () => {
    server.on("request", (req, res) => {
      const metaRes = createMetaRouteResponse(res);
      metaRes.options(["GET", "POST"]);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.headers.allow).toBe("GET, POST");
  });

  it("should set cookie", async () => {
    server.on("request", (req, res) => {
      const metaRes = createMetaRouteResponse(res);
      metaRes.cookie("test", "value", { maxAge: 3600 });
      metaRes.end();
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toEqual(["test=value; Max-Age=3600"]);
  });
});
