import { MetaRouteRequest } from "@metaroute/api/server";
import { WebhookProvider } from "@metaroute/api/webhooks/interfaces/webhook-provider.interface";
import * as crypto from "crypto";

export class GithubWebhookProvider implements WebhookProvider {
  verifyRequest(req: MetaRouteRequest, options: any) {
    const signature = req.headers["x-hub-signature"];

    const hmac = crypto.createHmac("sha1", options.secret);

    const payload = JSON.stringify(req.body);
    hmac.update(payload);

    const expectedSignature = `sha1=${hmac.digest("hex")}`;

    return signature === expectedSignature;
  }

  parsePayload(req: MetaRouteRequest) {
    return req.body;
  }
}
