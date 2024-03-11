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
  public async webhook(@Req() request: MetaRouteRequest) {
    const { provider, options, payload } = request.webhookMetadata;
    console.log(provider, options, payload);

    return ResponseEntity.ok({
      provider,
      options,
    });
  }
}
