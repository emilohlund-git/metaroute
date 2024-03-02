import { ErrorMiddleware, Middleware } from "@core/api/server/types";
import { Engine } from "@core/engine/engine.abstract";

export interface AppConfiguration {
  middleware?: Middleware[];
  errorMiddleware?: ErrorMiddleware[];
  port?: number;
  ssl?: {
    key: string;
    cert: string;
  };
  engine?: Engine;
}
