import { MemoryManager } from "@core/memory/memory-manager.core";
import { MetaRouteMemoryPolicy } from "@core/memory/policies/memory-policy.abstract";
import { MetaRoute } from "@core/common/meta-route.container";
import { jest } from "@jest/globals";
import { Injectable, Scope } from "@core/common";
import { MemoryUsage } from "@core/memory";

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

@Injectable({ scope: Scope.SINGLETON })
class MockPolicy extends MetaRouteMemoryPolicy {
  check(memoryUsage: MemoryUsage) {
    return true;
  }
  setup = () => {};
}

describe("MemoryManager", () => {
  let memoryManager: MemoryManager;
  let mockPolicy: MockPolicy;
  let warnSpy: any;

  beforeEach(() => {
    mockPolicy = new MockPolicy();
    memoryManager = new MemoryManager();
    jest.spyOn(MetaRoute, "getAllInstances").mockReturnValue([mockPolicy]);
    warnSpy = jest.spyOn(memoryManager["logger"], "warn");
  });

  afterEach(() => {
    memoryManager.cleanup();
    jest.clearAllMocks();
  });

  describe("setup", () => {
    it("should initialize policies", async () => {
      await memoryManager.setup();
      expect(memoryManager["policies"]).toContainEqual(mockPolicy);
    });

    it("should check memory usage and log warning if policy check returns true", async () => {
      await memoryManager.setup();
      jest.advanceTimersByTime(11000); // Advance time by 11 seconds to trigger the interval
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
