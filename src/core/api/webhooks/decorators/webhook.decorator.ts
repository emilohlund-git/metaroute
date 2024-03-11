import { ResponseEntity } from "@metaroute/api/entities";
import { MetaRouteRequest, MetaRouteResponse } from "@metaroute/api/server";
import { WebhookProvider } from "@metaroute/api/webhooks/interfaces/webhook-provider.interface";
import { ServiceIdentifier } from "@metaroute/common";

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
      console.log("Webhook Decorator - Received request");
      const [req, _] = extractReqRes(args);

      if (!req) return originalMethod.apply(this, args);

      console.log("Webhook Decorator - Extracted request");

      const webhookProvider = new provider();

      try {
        console.log("Webhook Decorator - Verifying request");
        webhookProvider.verifyRequest(req, options);
      } catch (error: any) {
        console.log(
          "Webhook Decorator - Error verifying request",
          error.message
        );
        return ResponseEntity.badRequest({
          success: false,
          message: "Error verifying webhook request",
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