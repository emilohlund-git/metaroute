import { LogLevel } from "../enums/log.level.enum";
import { Logger } from "./logger.service";

export class ConsoleLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  protected log(
    message: string,
    level: LogLevel,
    color: string = this.colors.fgCyan,
    context?: string,
    data?: any
  ) {
    if (this.levelToInt(level) < this.levelToInt(this.minLevel)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const dataOutput = data ? `\nData: ${JSON.stringify(data, null, 2)}` : ``;

    const logMessage = this.format
      .replace("{timestamp}", timestamp)
      .replace("{level}", level)
      .replace("{context}", context ? `[${context}]` : "")
      .replace("{message}", message)
      .replace("{data}", dataOutput)
      .replace(/"/g, "");

    console.log(`${color}${logMessage}${this.colors.reset}`);
  }
}
