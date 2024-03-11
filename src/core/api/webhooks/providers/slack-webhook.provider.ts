import { MetaRouteRequest } from "../../../api/server";
import { WebhookProvider } from "../../../api/webhooks/interfaces/webhook-provider.interface";
import * as crypto from "crypto";

export class SlackWebhookProvider implements WebhookProvider {
  verifyRequest(req: MetaRouteRequest, options: any) {
    const timestamp = req.headers["x-slack-request-timestamp"];
    const signature = Array.isArray(req.headers["x-slack-signature"])
      ? req.headers["x-slack-signature"][0]
      : req.headers["x-slack-signature"] ?? "";

    // Avoid replay attacks
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (Number(timestamp) < fiveMinutesAgo) return false;

    const sigBaseString = `v0:${timestamp}:${JSON.stringify(req.body)}`;
    const mySignature = `v0=${crypto
      .createHmac("sha256", options.secret)
      .update(sigBaseString, "utf8")
      .digest("hex")}`;

    return crypto.timingSafeEqual(
      Buffer.from(mySignature, "utf8"),
      Buffer.from(signature, "utf8")
    );
  }

  parsePayload(req: MetaRouteRequest) {
    return req.body;
  }
}
