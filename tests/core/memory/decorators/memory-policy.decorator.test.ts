import { MEMORY_POLICY_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { MetaRoute } from "@core/common/meta-route.container";
import { MemoryPolicy } from "@core/memory/decorators/memory-policy.decorator";
import "reflect-metadata";

describe("MemoryPolicy", () => {
  let target: any;
  let registerSpy: jest.SpyInstance;

  beforeEach(() => {
    target = function TestTarget() {};
    registerSpy = jest.spyOn(MetaRoute, "register");
  });

  afterEach(() => {
    registerSpy.mockRestore();
  });

  it("should define metadata for the target", () => {
    MemoryPolicy(target);
    const metadata = Reflect.getMetadata(MEMORY_POLICY_METADATA_KEY, target);
    expect(metadata).toBe(true);
  });

  it("should register the target with MetaRoute", () => {
    MemoryPolicy(target);
    expect(registerSpy).toHaveBeenCalledWith(target);
  });
});
