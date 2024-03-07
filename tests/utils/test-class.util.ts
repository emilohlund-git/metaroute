import { Body } from "@core/api/decorators/body.decorator";
import { Controller } from "@core/api/decorators/controller.decorator";
import {
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from "@core/api/decorators/handlers.decorator";
import { ApiKey } from "@core/api/guards/api-key.guard";
import { OnMessage } from "src";

@Controller("/test")
class TestClass {
  @ApiKey()
  testApiKeyMethod(req: any) {
    return "test";
  }

  @OnMessage("testEvent")
  testMethod(@Body() param: any) {}

  @Get("/get")
  getMethod() {}

  @Post("/post")
  postMethod() {}

  @Put("/put")
  putMethod() {}

  @Patch("/patch")
  patchMethod() {}

  @Delete("/delete")
  deleteMethod() {}
}

export default TestClass;
