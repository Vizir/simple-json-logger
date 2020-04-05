import stringify from "json-stringify-safe";
import { LogLevelEnum } from "./LogLevelEnum";
import CallSite = NodeJS.CallSite;

const logLevelsOrder: string[] = [
  LogLevelEnum.ERROR,
  LogLevelEnum.WARN,
  LogLevelEnum.INFO,
  LogLevelEnum.DEBUG,
];

export const getOrigin = (): string => {
  const CALLSITE_INDEX = 3;
  const originalPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_: Error, stack: CallSite[]): CallSite[] => stack;
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
};

export const createMessage = (
  level: string,
  message: string,
  context?: object,
  extra?: object
): string => {
  return stringify({
    ...context,
    ...extra,
    level,
    message: `${getOrigin()}: ${message}`,
  });
};

export const shouldLog = (
  logLevel: string,
  messageLevel: LogLevelEnum
): boolean => {
  const logLevelIndex = logLevelsOrder.indexOf(logLevel);
  const messageLevelIndex = logLevelsOrder.indexOf(messageLevel);

  return logLevelIndex >= messageLevelIndex;
};
