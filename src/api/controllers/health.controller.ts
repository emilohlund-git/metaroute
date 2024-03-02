import { Controller } from "@core/api/decorators/controller.decorator";
import { Get } from "@core/api/decorators/handlers.decorator";
import { ResponseEntity } from "@core/api/entities/response.entity";
import { MetaResponse } from "@core/api/types";

@Controller("/health")
export class HealthController {
  constructor() {}

  @Get("/")
  async checkHealth(): MetaResponse<any> {
    return ResponseEntity.ok({
      data: "Everything is running smoothly",
      message: "Health check",
      success: true,
    });
  }
}
