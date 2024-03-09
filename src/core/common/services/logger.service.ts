import { LogLevel } from "../enums/log.level.enum";

export abstract class Logger {
  protected context: string;
  protected minLevel: LogLevel;
  protected format: string =
    "[🌌 MetaRoute] - {timestamp} - {level} - {context} - {message}{data}";

  constructor(context: string) {
    this.context = context;
  }

  public setFormat(format: string) {
    this.format = format;
  }

  public setContext(context: string) {
    this.context = context;
  }

  public setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  public getMinLevel(): LogLevel {
    return this.minLevel;
  }

  protected colors = {
    reset: "\x1b[0m",
    fgRed: "\x1b[31m",
    fgYellow: "\x1b[33m",
    fgCyan: "\x1b[36m",
    fgGreen: "\x1b[32m",
    fgFadedCyan: "\x1b[2m\x1b[36m",
    fgFadedYellow: "\x1b[2m\x1b[33m",
    fgFadedRed: "\x1b[2m\x1b[31m",
    fgFadedGreen: "\x1b[2m\x1b[32m",
  };

  protected abstract log(
    message: string,
    level: LogLevel,
    color: string,
    context?: string,
    data?: any
  ): void;

  public info(message: string, data?: any) {
    this.log(message, LogLevel.INFO, this.colors.fgCyan, this.context, data);
  }

  public warn(message: string, data?: any) {
    this.log(message, LogLevel.WARN, this.colors.fgYellow, this.context, data);
  }

  public error(message: string, data?: any) {
    this.log(message, LogLevel.ERROR, this.colors.fgRed, this.context, data);
  }

  public debug(message: string, data?: any) {
    this.log(
      message,
      LogLevel.DEBUG,
      this.colors.fgFadedCyan,
      this.context,
      data
    );
  }

  public success(message: string, data?: any) {
    this.log(message, LogLevel.INFO, this.colors.fgGreen, this.context, data);
  }

  protected levelToInt(level: LogLevel): number {
    switch (level) {
      case LogLevel.SILENT:
        return 0;
      case LogLevel.DEBUG:
        return 1;
      case LogLevel.INFO:
        return 2;
      case LogLevel.WARN:
        return 3;
      case LogLevel.ERROR:
        return 4;
      default:
        return 5;
    }
  }
}
