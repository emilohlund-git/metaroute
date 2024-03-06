import {
  App,
  Application,
  Controller,
  Get,
  JsonMiddleware,
  LogErrorMiddleware,
  ResponseEntity,
  StaticFileMiddleware,
} from "./core";

@App({
  middleware: [JsonMiddleware, StaticFileMiddleware],
  errorMiddleware: [LogErrorMiddleware],
})
export class BackendApp extends Application {}

@Controller("/")
export class HomeController {
  @Get("/")
  get() {
    return ResponseEntity.ok();
  }
}
