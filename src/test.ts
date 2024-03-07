import { MetaRouteSocket } from "@core/api/server/interfaces/meta-route.socket";
import {
  App,
  Application,
  Controller,
  Get,
  OnMessage,
  SocketServer,
} from "./core";

@App({})
export class TestApp extends Application {}

@Controller("/test")
export class TestController {
  @Get("/")
  public async get() {
    return "Hello, World!";
  }
}

@SocketServer("/hello")
export class TestSocketServer {
  @OnMessage("/test")
  public async onConnection(data: any, socket: MetaRouteSocket) {
    return {
      event: "test",
      data: {
        message: "Hello, World!",
        client: socket.id,
      },
    };
  }
}
