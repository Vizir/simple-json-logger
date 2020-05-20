import faker from "faker";
import { Logger } from "../src/Logger";
import { LogLevelEnum } from "../src/LogLevelEnum";
import callSites from "callsites";

const DEFAULT_PLACE_HOLDER = "*sensitive*";

describe("simple-json-logger", () => {
  let testFunctionPrefix: string | null = null;

  beforeAll(async () => {
    const mockDate = new Date();
    // @ts-ignore
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    const origin = callSites()[3];

    testFunctionPrefix =
      origin.getFunctionName() !== null ? "test()" : origin.getFileName();
  });

  describe("creation", () => {
    it("Should create a logger without context", () => {
      // when
      const instantiate = (): Logger => new Logger();

      // then
      expect(instantiate).not.toThrow();
    });

    it("Should create a logger with context", () => {
      // given
      const context = {};

      // when
      const instantiate = (): Logger => new Logger(context);

      // then
      expect(instantiate).not.toThrow();
    });

    it("Should create a logger with empty options", () => {
      // given
      const context = {};

      // when
      const instantiate = (): Logger => new Logger(context, {});

      // then
      expect(instantiate).not.toThrow();
    });

    it("Should create a logger including words into blacklist", () => {
      // given
      const context = {};

      // when
      const instantiate = (): Logger =>
        new Logger(context, {
          includeBlackList: [faker.random.word()],
        });

      // then
      expect(instantiate).not.toThrow();
    });

    it("Should create a logger excluding words from blacklist", () => {
      // given
      const context = {};

      // when
      const instantiate = (): Logger =>
        new Logger(context, {
          excludeBlackList: [faker.random.word()],
        });

      // then
      expect(instantiate).not.toThrow();
    });
  });

  describe("debug", () => {
    it("Should print debug log when doesn't have a level configured", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "debug",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print debug log when configured level is debug", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "debug";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "debug",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should not print debug log when configured level is info", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "info";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should not print debug log when configured level is warn", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "warn";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should not print debug log when configured level is error", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "error";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Shouldn't log debug when configured level is unknown", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      process.env.LOG_LEVEL = faker.random.word();
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const logger = new Logger(context);
      const extra = {
        name: faker.name.findName(),
      };
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should print debug log filtering sensitive information", () => {
      // given
      process.env.LOG_LEVEL = "debug";
      const attribute1 = faker.random.word();
      const attribute2 = faker.random.word();
      const context = { [attribute1]: faker.lorem.paragraph() };
      const logger = new Logger(context, {
        includeBlackList: [attribute1, attribute2],
      });
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = { [attribute2]: faker.lorem.paragraph() };
      const expectedMessage = JSON.stringify({
        [attribute1]: DEFAULT_PLACE_HOLDER,
        level: "debug",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
        [attribute2]: DEFAULT_PLACE_HOLDER,
      });
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });
  });

  describe("info", () => {
    it("Should print info log when doesn't have a level configured", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "info",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print info log when configured level is debug", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "debug";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "info",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print info log when configured level is info", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "info";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "info",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should not print info log when configured level is warn", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "warn";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should not print info log when configured level is error", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "error";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Shouldn't log info when configured level is unknown", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      process.env.LOG_LEVEL = faker.random.word();
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const logger = new Logger(context);
      const extra = {
        name: faker.name.findName(),
      };
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should print info log filtering sensitive information", () => {
      // given
      process.env.LOG_LEVEL = "info";
      const attribute1 = faker.random.word();
      const attribute2 = faker.random.word();
      const context = { [attribute1]: faker.lorem.paragraph() };
      const logger = new Logger(context, {
        includeBlackList: [attribute1, attribute2],
      });
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = { [attribute2]: faker.lorem.paragraph() };
      const expectedMessage = JSON.stringify({
        [attribute1]: DEFAULT_PLACE_HOLDER,
        level: "info",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
        [attribute2]: DEFAULT_PLACE_HOLDER,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });
  });

  describe("warn", () => {
    it("Should print warn log when doesn't have a level configured", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "warn",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print warn log when configured level is debug", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "debug";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "warn",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print warn log when configured level is info", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "info";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "warn",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print warn log when configured level is warn", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "warn";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "warn",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should not print warn log when configured level is error", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "error";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Shouldn't log warn when configured level is unknown", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      process.env.LOG_LEVEL = faker.random.word();
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const logger = new Logger(context);
      const extra = {
        name: faker.name.findName(),
      };
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should print warn log filtering sensitive information", () => {
      // given
      process.env.LOG_LEVEL = "warn";
      const attribute1 = faker.random.word();
      const attribute2 = faker.random.word();
      const context = { [attribute1]: faker.lorem.paragraph() };
      const logger = new Logger(context, {
        includeBlackList: [attribute1, attribute2],
      });
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = { [attribute2]: faker.lorem.paragraph() };
      const expectedMessage = JSON.stringify({
        [attribute1]: DEFAULT_PLACE_HOLDER,
        level: "warn",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
        [attribute2]: DEFAULT_PLACE_HOLDER,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });
  });

  describe("error", () => {
    it("Should print error log when doesn't have a level configured", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print error log when configured level is debug", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "debug";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print error log when configured level is info", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "info";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print error log when configured level is warn", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "warn";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should print error log when configured level is error", () => {
      // given
      const context = {};
      process.env.LOG_LEVEL = "error";
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Shouldn't log error when configured level is unknown", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      process.env.LOG_LEVEL = faker.random.word();
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const logger = new Logger(context);
      const extra = {
        name: faker.name.findName(),
      };
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should print error log filtering sensitive information", () => {
      // given
      process.env.LOG_LEVEL = "error";
      const attribute1 = faker.random.word();
      const attribute2 = faker.random.word();
      const context = { [attribute1]: faker.lorem.paragraph() };
      const logger = new Logger(context, {
        includeBlackList: [attribute1, attribute2],
      });
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = { [attribute2]: faker.lorem.paragraph() };
      const expectedMessage = JSON.stringify({
        [attribute1]: DEFAULT_PLACE_HOLDER,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
        [attribute2]: DEFAULT_PLACE_HOLDER,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });
  });

  describe("log", () => {
    it("Should log debug level", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: LogLevelEnum.DEBUG,
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.debug = mock;

      // when
      logger.log(LogLevelEnum.DEBUG, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log info level", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "info",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.log(LogLevelEnum.INFO, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log warn level", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "warn",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.log(LogLevelEnum.WARN, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log error level", () => {
      // given
      const context = {};
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {};
      const expectedMessage = JSON.stringify({
        ...context,
        ...extra,
        level: "error",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.log(LogLevelEnum.ERROR, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log circular objects", () => {
      // given
      const context: { attribute?: object } = {};
      context.attribute = context;
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {
        name: faker.name.findName(),
      };
      const expectedMessage = JSON.stringify({
        attribute: "[Circular ~]",
        level: "debug",
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
        ...extra,
      });
      console.debug = mock;

      // when
      logger.log(LogLevelEnum.DEBUG, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log class and method name when log from a class", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      delete process.env.LOG_LEVEL;
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {
        name: faker.name.findName(),
      };
      const expectedMessage = JSON.stringify({
        ...context,
        level: "debug",
        datetime: new Date().toISOString(),
        message: `TestClass.testMethod(): ${message}`,
        ...extra,
      });
      console.debug = mock;

      class TestClass {
        private readonly logger: Logger;

        public constructor() {
          this.logger = new Logger(context);
        }

        public testMethod(): void {
          this.logger.debug(message, extra);
        }
      }

      // when
      new TestClass().testMethod();

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log function name when log from a function", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      delete process.env.LOG_LEVEL;
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {
        name: faker.name.findName(),
      };
      const expectedMessage = JSON.stringify({
        ...context,
        level: "debug",
        datetime: new Date().toISOString(),
        message: `testFunction(): ${message}`,
        ...extra,
      });
      console.debug = mock;
      const testFunction = (): void => {
        const logger = new Logger(context);
        logger.debug(message, extra);
      };

      // when
      testFunction();

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Should log file name when log from a not function", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      delete process.env.LOG_LEVEL;
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const logger = new Logger(context);
      const extra = {
        name: faker.name.findName(),
      };
      const expectedMessage = JSON.stringify({
        ...context,
        level: "debug",
        datetime: new Date().toISOString(),
        message: `${__filename}: ${message}`,
        ...extra,
      });
      console.debug = mock;

      // when
      ((): void => logger.debug(message, extra))();

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    it("Shouldn't log when configured level is unknown", () => {
      // given
      const context = {
        requestId: faker.random.uuid(),
      };
      process.env.LOG_LEVEL = faker.random.word();
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const logger = new Logger(context);
      const extra = {
        name: faker.name.findName(),
      };
      console.error = mock;

      // when
      logger.log(LogLevelEnum.ERROR, message, extra);

      // then
      expect(mock).not.toBeCalled();
    });

    it("Should log if the level is in upper case", () => {
      // given
      const context = {
        word: faker.random.word(),
      };
      delete process.env.LOG_LEVEL;
      const logger = new Logger(context);
      const message = faker.lorem.paragraph();
      const mock = jest.fn();
      const extra = {
        paragraph: faker.lorem.paragraph(),
      };
      const expectedMessage = JSON.stringify({
        ...context,
        level: LogLevelEnum.DEBUG,
        datetime: new Date().toISOString(),
        message: `${testFunctionPrefix}: ${message}`,
        ...extra,
      });
      console.debug = mock;

      // when
      logger.log("DEBUG" as LogLevelEnum, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });
  });
});
