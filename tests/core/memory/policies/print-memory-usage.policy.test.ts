import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { MemoryUsage } from "@core/memory/dtos/memory.usage.dto";
import { PrintMemoryUsageRule } from "@core/memory/policies/print-memory-usage.policy";

jest.mock("@core/common/services/console-logger.service");

describe("PrintMemoryUsageRule", () => {
  let printMemoryUsageRule: PrintMemoryUsageRule;
  let loggerMock: jest.Mocked<ConsoleLogger>;

  beforeEach(() => {
    loggerMock = new ConsoleLogger("TEST") as jest.Mocked<ConsoleLogger>;
    printMemoryUsageRule = new PrintMemoryUsageRule();
    // Replace the logger instance with the mock
    (printMemoryUsageRule as any).logger = loggerMock;
  });

  it("should log memory usage", () => {
    const memoryUsage: MemoryUsage = {
      rssInMB: 100,
      heapTotalInMB: 200,
      heapUsedInMB: 150,
      externalInMB: 50,
    };

    printMemoryUsageRule.check(memoryUsage);

    expect(loggerMock.info).toHaveBeenCalledTimes(1);
    expect(loggerMock.info).toHaveBeenCalledWith(
      `Memory usage: [rssInMb]: 100.00, [heapTotalInMb]: 200.00, [heapUsedInMb]: 150.00, [externalInMb]: 50.00`
    );
  });

  it("should always return false", () => {
    const memoryUsage: MemoryUsage = {
      rssInMB: 100,
      heapTotalInMB: 200,
      heapUsedInMB: 150,
      externalInMB: 50,
    };

    const result = printMemoryUsageRule.check(memoryUsage);

    expect(result).toBe(false);
  });
});
