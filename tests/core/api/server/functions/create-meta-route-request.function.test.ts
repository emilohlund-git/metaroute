import { IncomingMessage } from "http";
import { createMetaRouteRequest } from "src";

describe("createMetaRouteRequest", () => {
  it("should create a MetaRouteRequest with parseCookies method", () => {
    const req = {} as IncomingMessage;
    const metaReq = createMetaRouteRequest(req);

    expect(typeof metaReq.parseCookies).toBe("function");
  });

  it("should parse cookies correctly", () => {
    const req = {
      headers: {
        cookie: "name=value; name2=value2",
      },
    } as IncomingMessage;
    const metaReq = createMetaRouteRequest(req);

    const cookies = metaReq.parseCookies(req.headers.cookie);
    expect(cookies).toEqual({
      name: "value",
      name2: "value2",
    });
  });

  it("should return an empty object when no cookies are present", () => {
    const req = {} as IncomingMessage;
    const metaReq = createMetaRouteRequest(req);

    const cookies = metaReq.parseCookies(undefined);
    expect(cookies).toEqual({});
  });
});
