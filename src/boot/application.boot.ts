import { CorsMiddleware } from "@core/api/middleware/cors.middleware";
import { ErrorMiddleware } from "@core/api/middleware/error.middleware";
import { JsonMiddleware } from "@core/api/middleware/json.middleware";
import { LoggingMiddleware } from "@core/api/middleware/logging.middleware";
import { StaticFileMiddleware } from "@core/api/middleware/static.middleware";
import { App } from "@core/common/decorators/app.decorator";
import { Application } from "@core/common/interfaces/application.interface";
import { MetaEngine } from "@core/engine/meta.engine";

@App({
  middleware: [
    LoggingMiddleware,
    CorsMiddleware,
    JsonMiddleware,
    StaticFileMiddleware,
  ],
  errorMiddleware: [ErrorMiddleware],
  engine: new MetaEngine
})
export class MetaRouteApplication extends Application {}
