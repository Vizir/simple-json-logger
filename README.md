# @vizir/simple-json-logger

A fast, simple and opinionated json logger.

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

### NodeJS Sample with Typescript

```typescript
import { Logger } from "@vizir/simple-json-logger";

const logger = new Logger({
  app: "ConsoleApplication",
  requestId: "3a7d3223-e96f-47da-b3bb-73f609b9f55d",
});
logger.debug("debug message", { extraInfo: 123 });
logger.info("info message", { extraInfo: "abc" });
logger.warn("warn message", { moreInfo: "abc123" });
logger.error("error message", { otherInfo: "qwerty" });
```

## Support

Tested in Node.js 10-12.

## License

[The MIT License (MIT)](./LICENSE)
