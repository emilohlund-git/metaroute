import { ErrorMiddleware, Middleware } from "../../api/server/types";
import { Engine } from "../../engine/engine.abstract";
import { LogLevel } from "../enums";
import { ServiceIdentifier } from "../types";
import { Initializable } from "./initializable.interface";
import { LoggerOptions } from "./logger-options.interface";

export interface AppConfiguration {
  middleware?: Middleware[];
  errorMiddleware?: ErrorMiddleware[];
  port?: number;
  ssl?: {
    key: string;
    cert: string;
  };
  engine?: ServiceIdentifier<Engine>;
  initializers?: ServiceIdentifier<Initializable>[];
  /**
   * Either dynamically load imports by adding the ImportHandler initializer
   * to the initializers array, or statically load them by adding them to the
   * imports array.
   */
  imports?: ServiceIdentifier<any>[];
  logging?: Omit<LoggerOptions, "context">;
}
