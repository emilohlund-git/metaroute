import { App, Application, JsonMiddleware } from "./core";

@App({
  middleware: [JsonMiddleware],
})
export class MetaApp extends Application {}
