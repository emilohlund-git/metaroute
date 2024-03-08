import { Controller, Get, ResponseEntity } from "@core/api";

@Controller("/test")
export class TestController {
  @Get("/")
  public async get() {
    return ResponseEntity.ok();
  }
}
