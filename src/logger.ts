import stringify from "json-stringify-safe";
import { LoggerFilter } from "./logger-filter";
import { LogLevelEnum } from "./log-level-enum";
import callSites from "callsites";

interface LoggerOptions {
  includeBlackList?: string[];
  excludeBlackList?: string[];
  whiteList?: string[];
}

export class Logger {
  protected readonly logLevelsOrder: string[] = [
    LogLevelEnum.ERROR,
    LogLevelEnum.WARN,
    LogLevelEnum.INFO,
    LogLevelEnum.DEBUG,
  ];

  private readonly context?: object;

  private readonly level: string;

  private readonly filter: LoggerFilter;

  public constructor(context?: object, options?: LoggerOptions) {
    this.context = context;
    this.level =
      process.env.LOG_LEVEL !== undefined
        ? process.env.LOG_LEVEL
        : LogLevelEnum.DEBUG;
    this.filter = new LoggerFilter(
      options?.includeBlackList,
      options?.excludeBlackList,
      options?.whiteList
    );
  }

  public debug(message: string, extra?: object): void {
    if (!this.shouldLog(this.level, LogLevelEnum.DEBUG)) return;

    console.debug(
      this.createMessage(LogLevelEnum.DEBUG, message, this.context, extra)
    );
  }

  public error(message: string, extra?: object): void {
    if (!this.shouldLog(this.level, LogLevelEnum.ERROR)) return;

    console.error(
      this.createMessage(LogLevelEnum.ERROR, message, this.context, extra)
    );
  }

  public info(message: string, extra?: object): void {
    if (!this.shouldLog(this.level, LogLevelEnum.INFO)) return;

    console.info(
      this.createMessage(LogLevelEnum.INFO, message, this.context, extra)
    );
  }

  public log(rawLevel: LogLevelEnum, message: string, extra?: object): void {
    const level = rawLevel.toLocaleLowerCase() as LogLevelEnum;

    if (!this.shouldLog(this.level, level)) return;

    console[level](this.createMessage(level, message, this.context, extra));
  }

  public warn(message: string, extra?: object): void {
    if (!this.shouldLog(this.level, LogLevelEnum.WARN)) return;

    console.warn(
      this.createMessage(LogLevelEnum.WARN, message, this.context, extra)
    );
  }

  protected getOrigin(): string {
    const origin = callSites()[3];

    const methodName = origin.getMethodName();
    if (methodName !== null) {
      return `${origin.getTypeName()}.${methodName}()`;
    }

    const functionName = origin.getFunctionName();
    if (functionName !== null) {
      return `${functionName}()`;
    }

    const filename = origin.getFileName();
    /* istanbul ignore next */
    if (filename !== null) {
      return filename;
    }

    /* istanbul ignore next */
    return "unknown";
  }

  protected createMessage(
    level: string,
    message: string,
    context?: object,
    extra?: object
  ): string {
    return stringify({
      context: this.filter.process(context),
      level,
      datetime: new Date().toISOString(),
      message: `${this.getOrigin()}: ${message}`,
      extra: this.filter.process(extra),
    });
  }

  protected shouldLog(logLevel: string, messageLevel: LogLevelEnum): boolean {
    const logLevelIndex = this.logLevelsOrder.indexOf(logLevel);
    const messageLevelIndex = this.logLevelsOrder.indexOf(messageLevel);

    return logLevelIndex >= messageLevelIndex;
  }
}
