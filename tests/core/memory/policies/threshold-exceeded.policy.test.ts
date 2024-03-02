import { ConfigService } from "@core/common/services/config.service";
import { EnvironmentStore } from "@core/common/services/environment-store.service";
import { MemoryUsage } from "@core/memory/dtos/memory.usage.dto";
import { ThresholdExceededRule } from "@core/memory/policies/threshold-exceeded.policy";
import { mock } from "ts-mockito";

describe("ThresholdExceededRule", () => {
  let thresholdExceededRule: ThresholdExceededRule;
  let configService: ConfigService;
  let environmentStore: EnvironmentStore;

  beforeEach(() => {
    environmentStore = mock(EnvironmentStore);
    configService = new ConfigService(environmentStore);
    thresholdExceededRule = new ThresholdExceededRule(configService);
  });

  it("should be defined", () => {
    expect(thresholdExceededRule).toBeDefined();
  });

  describe("setup", () => {
    it("should set thresholdInMb from config service", () => {
      jest.spyOn(configService, "get").mockReturnValue("300");
      thresholdExceededRule.setup();
      expect(thresholdExceededRule["thresholdInMb"]).toEqual(300);
    });

    it("should set default thresholdInMb if config service returns non-number", () => {
      jest.spyOn(configService, "get").mockReturnValue("not-a-number");
      thresholdExceededRule.setup();
      expect(thresholdExceededRule["thresholdInMb"]).toEqual(200);
    });
  });

  describe("check", () => {
    it("should return true if memory usage exceeds threshold", () => {
      thresholdExceededRule["thresholdInMb"] = 100;
      const memoryUsage: MemoryUsage = {
        heapUsedInMB: 200,
        externalInMB: 0,
        rssInMB: 0,
        heapTotalInMB: 0,
      };
      expect(thresholdExceededRule.check(memoryUsage)).toBe(true);
    });

    it("should return false if memory usage does not exceed threshold", () => {
      thresholdExceededRule["thresholdInMb"] = 300;
      const memoryUsage: MemoryUsage = {
        heapUsedInMB: 200,
        externalInMB: 0,
        rssInMB: 0,
        heapTotalInMB: 0,
      };
      expect(thresholdExceededRule.check(memoryUsage)).toBe(false);
    });
  });
});
