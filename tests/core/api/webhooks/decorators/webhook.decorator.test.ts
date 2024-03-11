import {
  MetaRouteRequest,
  ResponseEntity,
  WebHook,
  WebhookProvider,
} from "@core/api";

describe("WebHook decorator", () => {
  let req: any;
  let res: any;

  class MockProvider implements WebhookProvider {
    verifyRequest(req: MetaRouteRequest, options: any) {
      return true;
    }

    parsePayload(req: MetaRouteRequest) {
      return {};
    }
  }

  beforeEach(() => {
    req = {
      headers: {},
      parseCookies: () => ({}),
    };
    res = {
      status: (num: number) => res,
    };
    process.env.API_KEY = "test";
  });

  it("should call the original method if verification succeeds", async () => {
    const options = {};
    const target = {};
    const propertyKey = "testMethod";

    const mockMethod = jest.fn().mockResolvedValue("original method result");

    const descriptor = {
      value: mockMethod,
    };

    const verifyRequestSpy = jest
      .spyOn(MockProvider.prototype, "verifyRequest")
      .mockReturnValue(true);

    const webhook = WebHook(MockProvider, options);
    webhook(target, propertyKey, descriptor);

    const result = await descriptor.value(req, res);

    expect(verifyRequestSpy).toHaveBeenCalledWith(req, options);
    expect(mockMethod).toHaveBeenCalled();
    expect(result).toBe("original method result");
  });

  it("should throw an error if verification fails", async () => {
    const options = {};
    const target = {};
    const propertyKey = "testMethod";

    const mockMethod = jest.fn().mockResolvedValue("original method result");

    const descriptor = {
      value: mockMethod,
    };

    const verifyRequestSpy = jest
      .spyOn(MockProvider.prototype, "verifyRequest")
      .mockImplementation(() => {
        throw new Error("Verification failed");
      });

    const webhook = WebHook(MockProvider, options);
    webhook(target, propertyKey, descriptor);

    expect(await descriptor.value(req, res)).toStrictEqual(
      ResponseEntity.badRequest({
        success: false,
        message: "Error verifying webhook request",
      })
    );

    expect(verifyRequestSpy).toHaveBeenCalledWith(req, options);
    expect(mockMethod).not.toHaveBeenCalled();
  });

  it("should return a bad request response if verification fails", async () => {
    const options = {};
    const target = {};
    const propertyKey = "testMethod";

    const mockMethod = jest.fn().mockResolvedValue("original method result");

    const descriptor = {
      value: mockMethod,
    };

    const verifyRequestSpy = jest
      .spyOn(MockProvider.prototype, "verifyRequest")
      .mockReturnValue(false);

    const webhook = WebHook(MockProvider, options);
    webhook(target, propertyKey, descriptor);

    const result = await descriptor.value(req, res);

    expect(verifyRequestSpy).toHaveBeenCalledWith(req, options);
    expect(mockMethod).not.toHaveBeenCalled();
    expect(result).toStrictEqual(
      ResponseEntity.badRequest({
        success: false,
        message: "Verification failed",
      })
    );
  });

  it("should return an internal server error response if the original method throws an error", async () => {
    const options = {};
    const target = {};
    const propertyKey = "testMethod";

    const mockMethod = jest.fn().mockImplementation(() => {
      throw new Error("Original method error");
    });

    const descriptor = {
      value: mockMethod,
    };

    const verifyRequestSpy = jest
      .spyOn(MockProvider.prototype, "verifyRequest")
      .mockReturnValue(true);

    const webhook = WebHook(MockProvider, options);
    webhook(target, propertyKey, descriptor);

    const result = await descriptor.value(req, res);

    expect(verifyRequestSpy).toHaveBeenCalledWith(req, options);
    expect(mockMethod).toHaveBeenCalled();
    expect(result).toStrictEqual(
      ResponseEntity.internalServerError({
        success: false,
        message: "An error occurred while processing the webhook",
      })
    );
  });
});
