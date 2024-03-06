import { MemoryManager } from "@core/memory/memory-manager.core";
import { MetaRouteMemoryPolicy } from "@core/memory/policies/memory-policy.abstract";
import { MetaRoute } from "@core/common/meta-route.container";
import { jest } from "@jest/globals";

jest.mock("@core/common/services/console-logger.service", () => {
  return {
    ConsoleLogger: jest.fn().mockImplementation(() => {
      return {
        debug: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      };
    }),
  };
});

jest.useFakeTimers();

describe("MemoryManager", () => {
  let memoryManager: MemoryManager;
  let mockPolicy: jest.Mocked<MetaRouteMemoryPolicy>;
  let warnSpy: any;

  beforeEach(() => {
    mockPolicy = {
      check: jest.fn(),
    } as any;
    jest.spyOn(MetaRoute, "getAllByScope").mockReturnValue([mockPolicy]);
    memoryManager = new MemoryManager();
    warnSpy = jest.spyOn(memoryManager["logger"], "warn");
  });

  afterEach(() => {
    memoryManager.cleanup();
    jest.clearAllMocks();
  });

  describe("setup", () => {
    it("should initialize policies", async () => {
      await memoryManager.setup();
      expect(memoryManager["policies"]).toEqual([mockPolicy]);
    });

    it("should check memory usage and log warning if policy check returns true", async () => {
      mockPolicy.check.mockReturnValue(true);
      await memoryManager.setup();
      jest.advanceTimersByTime(11000); // Advance time by 11 seconds to trigger the interval
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
