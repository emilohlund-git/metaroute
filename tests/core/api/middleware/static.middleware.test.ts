import fs from "fs";
import path from "path";
import { MetaRouteRequest, MetaRouteResponse } from "@api/server";
import { StaticFileMiddleware } from "@api/middleware";
import { NextFunction } from "@api/types";

jest.mock("fs");

describe("StaticFileMiddleware", () => {
  let req: Partial<MetaRouteRequest>;
  let res: Partial<MetaRouteResponse>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: "GET",
      url: "/static/test.html",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      end: jest.fn(),
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  it("should serve static files", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => false,
      isFile: () => true,
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("file content");

    StaticFileMiddleware(
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/html");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalledWith("file content");
  });

  it("should serve index.html for directories", () => {
    req.url = "/static/test";
    (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
      filePath = path.normalize(filePath);
      if (filePath.endsWith("index.html")) {
        return true; // index.html file exists
      } else {
        return filePath.includes(path.normalize("/public/test")); // directory exists
      }
    });
    (fs.lstatSync as jest.Mock).mockImplementation((filePath) => {
      filePath = path.normalize(filePath);
      if (filePath.endsWith("index.html")) {
        return { isDirectory: () => false, isFile: () => true }; // index.html is a file
      } else {
        return { isDirectory: () => true, isFile: () => false }; // directory is not a file
      }
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("index content");

    StaticFileMiddleware(
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/html");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalledWith("index content");
  });

  it("should return 404 for non-existent files", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    StaticFileMiddleware(
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Not found");
  });

  it("should call next for non-static routes", () => {
    req.url = "/test";

    StaticFileMiddleware(
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(next).toHaveBeenCalled();
  });

  it("should serve .css files with correct content type", () => {
    req.url = "/static/test.css";
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => false,
      isFile: () => true,
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("css content");

    StaticFileMiddleware(
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/css");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalledWith("css content");
  });

  it("should serve .js files with correct content type", () => {
    req.url = "/static/test.js";
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => false,
      isFile: () => true,
    });
    (fs.readFileSync as jest.Mock).mockReturnValue("js content");

    StaticFileMiddleware(
      req as MetaRouteRequest,
      res as MetaRouteResponse,
      next
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/javascript"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalledWith("js content");
  });
});
