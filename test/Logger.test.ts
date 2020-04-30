import faker from "faker";
import { Logger } from "../src/Logger";
import { LogLevelEnum } from "../src/LogLevelEnum";
import CallSite = NodeJS.CallSite;

let testFunctionPrefix: string | null;

describe("simple-json-logger", () => {
  beforeAll(async () => {
    const CALLSITE_INDEX_IN_TEST = 3;
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_: Error, stack: CallSite[]): CallSite[] =>
      stack;
    const originRaw = (new Error().stack as unknown) as CallSite[];
    Error.prepareStackTrace = originalPrepareStackTrace;
    const origin = originRaw[CALLSITE_INDEX_IN_TEST];

    testFunctionPrefix =
      origin.getFunctionName() !== null ? "test()" : origin.getFileName();
  });

  describe("creation", () => {
    test("Should create a logger without context", () => {
      // when
      const instantiate = (): Logger => new Logger();

      // then
      expect(instantiate).not.toThrow();
    });

    test("Should create a logger with context", () => {
      // given
      const context = {};

      // when
      const instantiate = (): Logger => new Logger(context);

      // then
      expect(instantiate).not.toThrow();
    });
  });

  describe("debug", () => {
    test("Should print debug log when doesn't have a level configured", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print debug log when configured level is debug", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.debug = mock;

      // when
      logger.debug(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should not print debug log when configured level is info", () => {
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

    test("Should not print debug log when configured level is warn", () => {
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

    test("Should not print debug log when configured level is error", () => {
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

    test("Shouldn't log debug when configured level is unknown", () => {
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
  });

  describe("info", () => {
    test("Should print info log when doesn't have a level configured", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print info log when configured level is debug", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print info log when configured level is info", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.info(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should not print info log when configured level is warn", () => {
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

    test("Should not print info log when configured level is error", () => {
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

    test("Shouldn't log info when configured level is unknown", () => {
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
  });

  describe("warn", () => {
    test("Should print warn log when doesn't have a level configured", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print warn log when configured level is debug", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print warn log when configured level is info", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print warn log when configured level is warn", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.warn(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should not print warn log when configured level is error", () => {
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

    test("Shouldn't log warn when configured level is unknown", () => {
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
  });

  describe("error", () => {
    test("Should print error log when doesn't have a level configured", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print error log when configured level is debug", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print error log when configured level is info", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print error log when configured level is warn", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should print error log when configured level is error", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.error(message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Shouldn't log error when configured level is unknown", () => {
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
  });

  describe("log", () => {
    test("Should log debug level", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.debug = mock;

      // when
      logger.log(LogLevelEnum.DEBUG, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should log info level", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.info = mock;

      // when
      logger.log(LogLevelEnum.INFO, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should log warn level", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.warn = mock;

      // when
      logger.log(LogLevelEnum.WARN, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should log error level", () => {
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
        message: `${testFunctionPrefix}: ${message}`,
      });
      console.error = mock;

      // when
      logger.log(LogLevelEnum.ERROR, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should log circular objects", () => {
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
        attribute: { attribute: "[Circular ~.attribute]" },
        level: "debug",
        message: `${testFunctionPrefix}: ${message}`,
        ...extra,
      });
      console.debug = mock;

      // when
      logger.log(LogLevelEnum.DEBUG, message, extra);

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Should log class and method name when log from a class", () => {
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

    test("Should log function name when log from a function", () => {
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

    test("Should log file name when log from a not function", () => {
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
        message: `${__filename}: ${message}`,
        ...extra,
      });
      console.debug = mock;

      // when
      ((): void => logger.debug(message, extra))();

      // then
      expect(mock).toBeCalledWith(expectedMessage);
    });

    test("Shouldn't log when configured level is unknown", () => {
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

    test("Should log if the level is in upper case", () => {
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
