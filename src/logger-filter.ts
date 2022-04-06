import stringify from "json-stringify-safe";
import { LosslessNumber, parse } from "lossless-json";
import { serializeError } from "serialize-error";
import { DEFAULT_BLACK_LIST } from "./default-black-list";

type TItem = { [key: string]: any };

export class LoggerFilter {
  private readonly blackList: string[];
  private readonly whiteList: string[];

  private readonly placeholder: string = "*sensitive*";

  public constructor(
    includeBlackList: string[] = [],
    excludeBlackList: string[] = [],
    whiteList: string[] = []
  ) {
    this.blackList = this.generateBlackList(includeBlackList, excludeBlackList);
    this.whiteList = whiteList;
  }

  public process(item?: any): object {
    if (item === undefined || item === null || item.constructor !== Object) {
      return {};
    }

    try {
      return this.filterObject(item);
    } catch (error) {
      /* istanbul ignore next */
      return {};
    }
  }

  private filterObject(item: TItem): TItem {
    const result: any = {};

    const objectWithoutCircularReference = parse(stringify(item));
    Object.keys(item).forEach((key: string): void => {
      const innerObject = this.isPlainObject(item[key])
        ? objectWithoutCircularReference[key]
        : item[key];

      result[key] = this.filterItem(key, innerObject);
    });

    return result;
  }

  private isLossLessNumber(value: any): boolean {
    if (value instanceof LosslessNumber) {
      return true;
    }

    if (value?.constructor === Object && value.type === "LosslessNumber") {
      return true;
    }

    return false;
  }

  private filterItem(key: string, item: any): any {
    if (this.isOnBlacklist(key) && !this.isOnWhitelist(key)) {
      return this.placeholder;
    }

    if (item instanceof Error) {
      return this.filterObject(this.filterError(item));
    }

    if (this.isLossLessNumber(item)) {
      return item.value;
    }

    if (this.isPlainObject(item)) {
      return this.filterObject(item);
    }

    if (this.isJSONString(item)) {
      return this.filterItem(key, parse(item));
    }

    if (Array.isArray(item)) {
      return item.map(this.filterItem.bind(this, key));
    }

    return item;
  }

  private isOnBlacklist(key: string): boolean {
    return this.blackList.some((blacklistedKey: string) =>
      key.toLocaleLowerCase().includes(blacklistedKey.toLocaleLowerCase())
    );
  }

  private isOnWhitelist(key: string): boolean {
    return this.whiteList.some((whitelistedKey: string) =>
      key.toLocaleLowerCase().includes(whitelistedKey.toLocaleLowerCase())
    );
  }

  private isPlainObject(value: any): boolean {
    return value?.constructor === Object;
  }

  private isJSONString(value: any): boolean {
    if (typeof value !== "string") {
      return false;
    }

    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  private generateBlackList(
    includeBlackList: string[],
    excludeBlackList: string[]
  ): string[] {
    const newBlackList = DEFAULT_BLACK_LIST.filter(
      (item: string): boolean => !excludeBlackList.includes(item)
    );
    return newBlackList.concat(includeBlackList);
  }

  private filterError(error: any) {
    if (error.isAxiosError) {
      return serializeError({
        config: error.config,
        message: error.message,
        name: error.name,
        response: {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
        },
      });
    }

    return serializeError(error);
  }
}
