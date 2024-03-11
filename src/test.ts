import {
  Controller,
  Get,
  JsonMiddleware,
  MetaRouteRequest,
  Post,
  Req,
  ResponseEntity,
} from "@metaroute/api";
import { WebHook } from "@metaroute/api/webhooks/decorators/webhook.decorator";
import { GithubWebhookProvider } from "@metaroute/api/webhooks/providers/github-webhook.provider";
import { SlackWebhookProvider } from "@metaroute/api/webhooks/providers/slack-webhook.provider";
import { App, Application } from "@metaroute/configuration";

@App({
  middleware: [JsonMiddleware],
})
export class TestApp extends Application {}

@Controller("/")
export class TestController {
  @Get("/")
  public async index() {
    return ResponseEntity.ok();
  }

  @Post("/github")
  @WebHook(GithubWebhookProvider, {
    secret: "github-webhook",
  })
  public async githubWebhook(@Req() request: MetaRouteRequest) {
    const { provider, options, payload } = request.webhookMetadata;
    console.log(provider, options, payload);

    return ResponseEntity.ok({
      provider,
      options,
    });
  }

  @Post("/slack")
  @WebHook(SlackWebhookProvider, {
    secret: "slack-webhook",
  })
  public async slackWebhook(@Req() request: MetaRouteRequest) {
    const { provider, options, payload } = request.webhookMetadata;
    console.log(provider, options, payload);

    if (payload.type === "url_verification") {
      return ResponseEntity.ok(payload.challenge);
    }

    return ResponseEntity.ok({
      provider,
      options,
    });
  }
}
