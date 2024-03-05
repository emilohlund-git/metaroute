import { ServerResponse } from "http";
import httpMocks from "node-mocks-http";
import { createMetaRouteResponse } from "src";

describe("createMetaRouteResponse", () => {
  let res: ServerResponse;
  let metaRouteResponse: any;

  beforeEach(() => {
    res = httpMocks.createResponse();
    metaRouteResponse = createMetaRouteResponse(res);
  });

  it("should set status code", () => {
    metaRouteResponse.status(200);
    expect(res.statusCode).toBe(200);
  });

  it("should set header", () => {
    metaRouteResponse.set("Content-Type", "application/json");
    expect(res.getHeader("Content-Type")).toBe("application/json");
  });

  it("should redirect", () => {
    metaRouteResponse.redirect("http://example.com");
    expect(res.statusCode).toBe(302);
    expect(res.getHeader("Location")).toBe("http://example.com");
  });

  it("should set options", () => {
    metaRouteResponse.options(["GET", "POST"]);
    expect(res.statusCode).toBe(200);
    expect(res.getHeader("Allow")).toBe("GET, POST");
  });

  it("should set cookie", () => {
    metaRouteResponse.cookie("name", "value", { maxAge: 3600, httpOnly: true });
    expect(res.getHeader("Set-Cookie")).toBe(
      "name=value; Max-Age=3600; HttpOnly"
    );
  });
});
