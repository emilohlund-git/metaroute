import { LogLevel } from "@core/common/enums/log.level.enum";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { mock, instance, when, anything, verify } from "ts-mockito";

describe("ConsoleLogger", () => {
  let logger: ConsoleLogger;
  let consoleMock: Console;

  beforeEach(() => {
    consoleMock = mock<Console>();
    global.console = instance(consoleMock);
    logger = new ConsoleLogger("TestContext");
  });

  it("should not log if level is less than minLevel", () => {
    logger.setMinLevel(LogLevel.ERROR);
    logger.info("Test message", LogLevel.INFO);
    verify(consoleMock.log(anything())).never();
  });

  it("should log if level is equal or greater than minLevel", () => {
    logger.setMinLevel(LogLevel.INFO);
    logger.info("Test message", LogLevel.INFO);
    verify(consoleMock.log(anything())).once();
  });
});
