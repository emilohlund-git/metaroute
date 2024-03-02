import { ConfigService } from "@core/common/services/config.service";
import { EnvironmentStore } from "@core/common/services/environment-store.service";
import { MemoryUsage } from "@core/memory/dtos/memory.usage.dto";
import { RapidIncreaseRule } from "@core/memory/policies/rapid-increase.policy";
import { mock } from "ts-mockito";

describe("RapidIncreaseRule", () => {
  let configService: ConfigService;
  let rapidIncreaseRule: RapidIncreaseRule;
  let environmentStore: EnvironmentStore;

  beforeEach(() => {
    environmentStore = mock(EnvironmentStore);
    configService = new ConfigService(environmentStore);
    rapidIncreaseRule = new RapidIncreaseRule(configService);
  });

  it("should setup threshold from config service", () => {
    const threshold = "100";
    jest.spyOn(configService, "get").mockReturnValue(threshold);
    rapidIncreaseRule.setup();
    expect(configService.get).toHaveBeenCalledWith("MEMORY_INCREASE_THRESHOLD");
  });

  it("should return false if memory usage history is less than 10", () => {
    const memoryUsage: MemoryUsage = {
      heapUsedInMB: 50,
      heapTotalInMB: 100,
      externalInMB: 0,
      rssInMB: 0,
    };
    expect(rapidIncreaseRule.check(memoryUsage)).toBe(false);
  });

  it("should calculate average memory usage and return true if increase is above threshold", () => {
    const threshold = "50";
    jest.spyOn(configService, "get").mockReturnValue(threshold);
    rapidIncreaseRule.setup();

    const memoryUsageHistory = Array.from({ length: 10 }, (_, i) => ({
      heapUsedInMB: i * 10,
      heapTotalInMB: 100,
      externalInMB: 0,
      rssInMB: 0,
    }));
    memoryUsageHistory.forEach((usage) => rapidIncreaseRule.check(usage));

    const memoryUsage: MemoryUsage = {
      heapUsedInMB: 200,
      heapTotalInMB: 300,
      externalInMB: 0,
      rssInMB: 0,
    };
    expect(rapidIncreaseRule.check(memoryUsage)).toBe(true);
  });

  it("should calculate average memory usage and return false if increase is below threshold", () => {
    const threshold = "200";
    jest.spyOn(configService, "get").mockReturnValue(threshold);
    rapidIncreaseRule.setup();

    const memoryUsageHistory = Array.from({ length: 10 }, (_, i) => ({
      heapUsedInMB: i * 10,
      heapTotalInMB: 100,
      externalInMB: 0,
      rssInMB: 0,
    }));
    memoryUsageHistory.forEach((usage) => rapidIncreaseRule.check(usage));

    const memoryUsage: MemoryUsage = {
      heapUsedInMB: 200,
      heapTotalInMB: 300,
      externalInMB: 0,
      rssInMB: 0,
    };
    expect(rapidIncreaseRule.check(memoryUsage)).toBe(false);
  });
});
