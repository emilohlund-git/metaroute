import { MemoryManager } from "@core/memory/memory-manager.core";
import { MetaRouteMemoryPolicy } from "@core/memory/policies/memory-policy.abstract";
import { MetaRoute } from "@core/common/meta-route.container";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { jest } from "@jest/globals";

jest.mock("@core/common/services/console-logger.service");

describe("MemoryManager", () => {
  let memoryManager: MemoryManager;
  let mockPolicy: jest.Mocked<MetaRouteMemoryPolicy>;
  let loggerMock: jest.Mocked<ConsoleLogger>;

  beforeEach(() => {
    mockPolicy = {
      check: jest.fn(),
    } as any;
    jest.spyOn(MetaRoute, "getAllByDecorator").mockReturnValue([mockPolicy]);
    memoryManager = new MemoryManager();
    loggerMock = new ConsoleLogger("TEST") as jest.Mocked<ConsoleLogger>;
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
  });
});
