import { LogLevel } from "../../common/enums";

export interface LoggerOptions {
  level?: LogLevel;
  context?: string;
  format?: string;
}
