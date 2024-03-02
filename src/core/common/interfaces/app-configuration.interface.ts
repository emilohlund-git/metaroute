import { ErrorMiddleware, Middleware } from "../../api/server/types";
import { Engine } from "../../engine/engine.abstract";

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
