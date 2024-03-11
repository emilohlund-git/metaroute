import { MetaRouteRequest } from "@metaroute/api/server";
import { WebhookProvider } from "@metaroute/api/webhooks/interfaces/webhook-provider.interface";
import * as crypto from "crypto";

export class GithubWebhookProvider implements WebhookProvider {
  verifyRequest(req: MetaRouteRequest, options: any) {
    console.log("GithubWebhookProvider - Verifying request");
    const signature = req.headers["x-hub-signature"];

    console.log("GithubWebhookProvider - Extracted signature", signature);

    const hmac = crypto.createHmac("sha1", options.secret);

    console.log("GithubWebhookProvider - Created hmac", hmac);

    const payload = JSON.stringify(req.body);
    hmac.update(payload);

    console.log("GithubWebhookProvider - Updated hmac with payload", payload);

    const expectedSignature = `sha1=${hmac.digest("hex")}`;

    console.log(
      "GithubWebhookProvider - Created expected signature",
      expectedSignature
    );

    return signature === expectedSignature;
  }

  parsePayload(req: MetaRouteRequest) {
    return req.body;
  }
}
