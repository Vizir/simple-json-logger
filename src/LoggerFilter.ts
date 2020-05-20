import stringify from "json-stringify-safe";
import { DEFAULT_BLACK_LIST } from "./DefaultBlackList";

type TItem = { [key: string]: any };

export class LoggerFilter {
  private readonly blackList: string[];

  private readonly placeholder: string = "*sensitive*";

  public constructor(
    includeBlackList: string[] = [],
    excludeBlackList: string[] = []
  ) {
    this.blackList = this.generateBlackList(includeBlackList, excludeBlackList);
  }

  public process(item?: TItem): object | undefined {
    if (item === undefined) {
      return item;
    }

    return this.filterItem(this.clone(item));
  }

  private filterItem(item: TItem): object {
    Object.keys(item).forEach((key: string): void => {
      if (this.isPlainObject(item[key])) {
        item[key] = this.process(item[key]);
        return;
      }

      if (this.isJSONString(item[key])) {
        item[key] = stringify(this.process(JSON.parse(item[key])));
        return;
      }

      if (Array.isArray(item[key])) {
        item[key] = item[key].map(this.filterItem.bind(this));
        return;
      }

      if (!this.isJSONType(item[key])) {
        delete item[key];
        return;
      }

      if (this.isOnBlacklist(key)) {
        item[key] = this.placeholder;
      }
    });

    return item;
  }

  private clone(item: object): object {
    return JSON.parse(stringify(item));
  }

  private isOnBlacklist(key: string): boolean {
    return this.blackList.some((blacklistedKey: string) =>
      key.toLowerCase().includes(blacklistedKey.toLowerCase())
    );
  }

  private isPlainObject(value: any): boolean {
    return value?.constructor === Object;
  }

  private isJSONType(value: any): boolean {
    return (
      typeof value !== "object" ||
      Array.isArray(value) ||
      this.isPlainObject(value) ||
      value instanceof Date
    );
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
}
