import { Injectable } from "../decorators/injectable.decorator";
import { LogLevel } from "../enums/log.level.enum";
import { Scope } from "../enums/scope.enum";
import { MetaRoute } from "../meta-route.container";
import { ConfigService } from "./config.service";
import { Logger } from "./logger.service";

@Injectable({ scope: Scope.TRANSIENT })
export class ConsoleLogger extends Logger {
  constructor(context: string) {
    const configService = MetaRoute.resolve(ConfigService);
    super(context, configService.getString("LOG_LEVEL", LogLevel.INFO) as LogLevel);
  }

  protected log(
    message: string,
    level: LogLevel,
    color: string = this.colors.fgCyan,
    context?: string,
    data?: any
  ) {
    if (
      this.levelToInt(level) < this.levelToInt(this.minLevel) ||
      this.minLevel == LogLevel.SILENT
    ) {
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
