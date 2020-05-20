import { DEFAULT_BLACK_LIST } from "../src/DefaultBlackList";
import { LoggerFilter } from "../src/LoggerFilter";
import faker from "faker";

const DEFAULT_PLACE_HOLDER = "*sensitive*";

describe("LoggerFilter", () => {
  it("Should return empty object when parameter is undefined", () => {
    // Given
    const item = undefined;
    const filter = new LoggerFilter();
    const expectedResult = {};

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should return the original data when none sensitive data is found", () => {
    // Given
    const word = faker.lorem.word();
    const item = { word };
    const expectedResult = { word };
    const filter = new LoggerFilter();

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace some default blacklist word", () => {
    // Given
    const key = faker.random.arrayElement(DEFAULT_BLACK_LIST);
    const word = faker.random.word();
    const item = { [key]: word };
    const expectedResult = { [key]: DEFAULT_PLACE_HOLDER };
    const filter = new LoggerFilter();

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace some default blacklist word as is in another case", () => {
    // Given
    const rawKey = faker.random.arrayElement(DEFAULT_BLACK_LIST);
    const key = rawKey.toLocaleUpperCase();
    const word = faker.random.word();
    const item = { [key]: word };
    const expectedResult = { [key]: DEFAULT_PLACE_HOLDER };
    const filter = new LoggerFilter();

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Shouldn't replace some default blacklist word when it's in excludeBlackList", () => {
    // Given
    const key = faker.random.arrayElement(DEFAULT_BLACK_LIST);
    const word = faker.random.word();
    const item = { [key]: word };
    const expectedResult = { [key]: word };

    const filter = new LoggerFilter([], [key]);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace some new item in blacklist", () => {
    // Given
    const key = faker.random.word();
    const word = faker.random.word();
    const item = { [key]: word };
    const expectedResult = { [key]: DEFAULT_PLACE_HOLDER };
    const filter = new LoggerFilter([key], []);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace into a nested object", () => {
    // Given
    const key = faker.random.word();
    const word = faker.random.word();
    const item = { nested: { [key]: word } };
    const expectedResult = { nested: { [key]: DEFAULT_PLACE_HOLDER } };
    const filter = new LoggerFilter([key], []);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace into a nested stringify object", () => {
    // Given
    const key = faker.random.word();
    const word = faker.random.word();
    const item = { nested: JSON.stringify({ [key]: word }) };
    const expectedResult = {
      nested: JSON.stringify({ [key]: DEFAULT_PLACE_HOLDER }),
    };
    const filter = new LoggerFilter([key], []);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace into a nested object inside an array", () => {
    // Given
    const key = faker.random.word();
    const word = faker.random.word();
    const item = { nested: [{ [key]: word }] };
    const expectedResult = { nested: [{ [key]: DEFAULT_PLACE_HOLDER }] };
    const filter = new LoggerFilter([key], []);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace boolean values in blacklist", () => {
    // Given
    const key = faker.random.word();
    const bool = faker.random.boolean();
    const item = { nested: { [key]: bool } };
    const expectedResult = { nested: { [key]: DEFAULT_PLACE_HOLDER } };
    const filter = new LoggerFilter([key], []);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace when the value is null", () => {
    // Given
    const key = faker.random.word();
    const value = null;
    const item = { nested: { [key]: value } };
    const expectedResult = { nested: { [key]: DEFAULT_PLACE_HOLDER } };
    const filter = new LoggerFilter([key], []);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should can work with array of string", () => {
    // Given
    const ids = [faker.random.uuid(), faker.random.uuid(), faker.random.uuid()];
    const item = { ids };
    const expectedResult = { ids };
    const filter = new LoggerFilter();

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should replace an item value when it is an array of string", () => {
    // Given
    const key = faker.random.arrayElement(DEFAULT_BLACK_LIST);
    const ids = [faker.random.uuid(), faker.random.uuid(), faker.random.uuid()];
    const item = { [key]: ids };
    const expectedResult = { [key]: DEFAULT_PLACE_HOLDER };
    const filter = new LoggerFilter();

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Shouldn't replace into a nested object", () => {
    // Given
    const key = faker.random.arrayElement(DEFAULT_BLACK_LIST);
    const word = faker.random.word();
    const item = { nested: { [key]: { word } } };
    const expectedResult = { nested: { [key]: { word } } };
    const filter = new LoggerFilter([], [key]);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should work with null values", () => {
    // Given
    const key = faker.random.arrayElement(DEFAULT_BLACK_LIST);
    const value = null;
    const item = { nested: { [key]: { word: value } } };
    const expectedResult = { nested: { [key]: { word: value } } };
    const filter = new LoggerFilter([], [key]);

    // When
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });

  it("Should work with invalid input", () => {
    // Given
    const item = faker.random.word();
    const expectedResult = {};
    const filter = new LoggerFilter();

    // When
    // @ts-ignore
    const parsed = filter.process(item);

    // Then
    expect(parsed).toStrictEqual(expectedResult);
  });
});
