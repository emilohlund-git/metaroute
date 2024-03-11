import { ResponseEntity } from "../../../api/entities";
import { MetaRouteRequest, MetaRouteResponse } from "../../../api/server";
import { WebhookProvider } from "../../../api/webhooks/interfaces/webhook-provider.interface";
import { ServiceIdentifier } from "../../../common";

function isMetaRouteRequest(arg: any): arg is MetaRouteRequest {
  return arg?.headers && typeof arg?.parseCookies === "function";
}

function isMetaRouteResponse(arg: any): arg is MetaRouteResponse {
  return typeof arg?.status === "number";
}

function extractReqRes(
  args: any[]
): [MetaRouteRequest | undefined, MetaRouteResponse | undefined] {
  let req = args.find(isMetaRouteRequest);
  let res = args.find(isMetaRouteResponse);

  return [req, res];
}

export function WebHook(
  provider: ServiceIdentifier<WebhookProvider>,
  options: any
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, _] = extractReqRes(args);

      if (!req) return await originalMethod.apply(this, args);

      const webhookProvider = new provider();

      let verificationResult;
      try {
        verificationResult = webhookProvider.verifyRequest(req, options);
      } catch (error: any) {
        return ResponseEntity.badRequest({
          success: false,
          message: "Error verifying webhook request",
        });
      }

      if (!verificationResult) {
        return ResponseEntity.badRequest({
          success: false,
          message: "Verification failed",
        });
      }

      const payload = webhookProvider.parsePayload(req);
      req.webhookMetadata = {
        options,
        provider,
        payload,
      };

      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        return ResponseEntity.internalServerError({
          success: false,
          message: "An error occurred while processing the webhook",
        });
      }
    };

    return descriptor;
  };
}
