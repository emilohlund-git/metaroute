import { getClientIp } from "@core/api/functions";

describe("getClientIp", () => {
  it("should return IP from X_FORWARDED_FOR header if present", () => {
    const req: any = {
      headers: {
        "x-forwarded-for": "192.0.2.0",
      },
      socket: {
        remoteAddress: "203.0.113.0",
      },
    };
    expect(getClientIp(req)).toEqual("192.0.2.0");
  });

  it("should return IP from known IP headers if X_FORWARDED_FOR is not present", () => {
    const req: any = {
      headers: {
        "x-real-ip": "192.0.2.0",
      },
      socket: {
        remoteAddress: "203.0.113.0",
      },
    };
    expect(getClientIp(req)).toEqual("192.0.2.0");
  });

  it("should return IP from forwarded header if no known IP headers are present", () => {
    const req: any = {
      headers: {
        forwarded: "192.0.2.0",
      },
      socket: {
        remoteAddress: "203.0.113.0",
      },
    };
    expect(getClientIp(req)).toEqual("192.0.2.0");
  });

  it("should return IP from req.socket.remoteAddress if no headers are present", () => {
    const req: any = {
      headers: {},
      socket: {
        remoteAddress: "203.0.113.0",
      },
    };
    expect(getClientIp(req)).toEqual("203.0.113.0");
  });

  it("should return undefined if no IP can be determined", () => {
    const req: any = {
      headers: {},
      socket: {},
    };
    expect(getClientIp(req)).toBeUndefined();
  });
});
