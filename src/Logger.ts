import stringify from "json-stringify-safe";
import { LogLevelEnum } from "./LogLevelEnum";
import CallSite = NodeJS.CallSite;

export class Logger {
  protected readonly logLevelsOrder: string[] = [
    LogLevelEnum.ERROR,
    LogLevelEnum.WARN,
    LogLevelEnum.INFO,
    LogLevelEnum.DEBUG,
  ];
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

  public log(level: LogLevelEnum, message: string, extra?: object): void {
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
    const CALLSITE_INDEX = 3;
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_: Error, stack: CallSite[]): CallSite[] =>
      stack;
    const originRaw = (new Error().stack as unknown) as CallSite[];
    Error.prepareStackTrace = originalPrepareStackTrace;
    const origin = originRaw[CALLSITE_INDEX];

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
      ...context,
      ...extra,
      level,
      message: `${this.getOrigin()}: ${message}`,
    });
  }

  protected shouldLog(logLevel: string, messageLevel: LogLevelEnum): boolean {
    const logLevelIndex = this.logLevelsOrder.indexOf(logLevel);
    const messageLevelIndex = this.logLevelsOrder.indexOf(messageLevel);

    return logLevelIndex >= messageLevelIndex;
  }
}
