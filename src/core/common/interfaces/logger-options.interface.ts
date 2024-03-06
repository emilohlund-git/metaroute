import { LogLevel } from "../enums";

export interface LoggerOptions {
  level?: LogLevel;
  context?: string;
  format?: string;
}
