import { LogLevelEnum } from "./log-level-enum";

export interface LoggerOptions {
  includeBlackList?: string[];
  excludeBlackList?: string[];
  logLevel?: LogLevelEnum;
  whiteList?: string[];
  originIndex?: number;
}
