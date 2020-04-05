import { LogLevelEnum } from "./LogLevelEnum";
import { createMessage, shouldLog } from "./Utils";

export class Logger {
  private readonly context?: object;
  private readonly level: string;

  public constructor(context?: object) {
    this.context = context;
    this.level =
      process.env.LOG_LEVEL !== undefined
        ? process.env.LOG_LEVEL
        : LogLevelEnum.DEBUG;
  }

  public debug(message: string, extra?: object): void {
    if (!shouldLog(this.level, LogLevelEnum.DEBUG)) return;

    console.debug(
      createMessage(LogLevelEnum.DEBUG, message, this.context, extra)
    );
  }

  public error(message: string, extra?: object): void {
    if (!shouldLog(this.level, LogLevelEnum.ERROR)) return;

    console.error(
      createMessage(LogLevelEnum.ERROR, message, this.context, extra)
    );
  }

  public info(message: string, extra?: object): void {
    if (!shouldLog(this.level, LogLevelEnum.INFO)) return;

    console.info(
      createMessage(LogLevelEnum.INFO, message, this.context, extra)
    );
  }

  public log(level: LogLevelEnum, message: string, extra?: object): void {
    if (!shouldLog(this.level, level)) return;

    console[level](createMessage(level, message, this.context, extra));
  }

  public warn(message: string, extra?: object): void {
    if (!shouldLog(this.level, LogLevelEnum.WARN)) return;

    console.warn(
      createMessage(LogLevelEnum.WARN, message, this.context, extra)
    );
  }
}
