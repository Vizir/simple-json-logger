# @vizir/simple-json-logger

A fast, simple and opinionated json logger to stdout.

## Motivation

This library is designed to be an easy and fast way to log json messages to `stdout`.

If you want a more advanced solution, we recommend to you use [winston](https://www.npmjs.com/package/winston).

## Installation

```sh
$ npm install @vizir/simple-json-logger
```

## Usage

### NodeJS Sample with Javascript

```javascript
const { Logger } = require("@vizir/simple-json-logger");

const logger = new Logger({
  app: "ConsoleApplication",
  requestId: "3a7d3223-e96f-47da-b3bb-73f609b9f55d",
});
logger.debug("debug message", { extraInfo: 123 });
logger.info("info message", { extraInfo: "abc" });
logger.warn("warn message", { moreInfo: "abc123" });
logger.error("error message", { otherInfo: "qwerty" });
```

### Security Filtering

By default, the logger will filter some sensitive values from logs output. You can add or remove the default
blacklist, using the _includeBlackList_ or _excludeBlackList_ attribute into options, as following:

_The black list check is case insensitive._

```javascript
const logger = new Logger(
  {
    app: "ConsoleApplication",
    requestId: "3a7d3223-e96f-47da-b3bb-73f609b9f55d",
  },
  {
    includeBlackList: ["myPasswordField"],
    excludeBlackList: ["accessToken"],
  }
);
logger.error("error message", { myPasswordField: "qwerty" });
```

The output of the following command are:

```json
{
  "app": "ConsoleApplication",
  "requestId": "3a7d3223-e96f-47da-b3bb-73f609b9f55d",
  "level": "error",
  "datetime": "2020-05-20T00:20:10.432Z",
  "message": "origin: error message",
  "myPasswordField": "*sensitive*"
}
```

## Support

Tested in Node.js 10-12.

## License

[The MIT License (MIT)](./LICENSE)
