import { MetaRouteRequest } from "../../../api/server";

export interface WebhookProvider {
  verifyRequest: (req: MetaRouteRequest, options: any) => boolean;
  parsePayload: (req: MetaRouteRequest) => any;
}
