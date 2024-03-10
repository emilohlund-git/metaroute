import {
  App,
  Application,
  Controller,
  Get,
  JsonMiddleware,
  LoggingMiddleware,
  Param,
  ParseIntPipe,
  Post,
  Query,
  RateLimit,
  ResponseEntity,
} from "./core";

@App({
  middleware: [LoggingMiddleware, JsonMiddleware],
})
export class TestApp extends Application {}

@Controller("/")
export class TestController {
  @Get("/:id")
  @RateLimit({ bucketSize: 2, tokensPerSecond: 1 })
  public async index(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: any
  ) {
    return ResponseEntity.ok({ params: id, query });
  }

  @Post("/")
  public async create() {
    return ResponseEntity.created({ message: "Resource created" });
  }
}
