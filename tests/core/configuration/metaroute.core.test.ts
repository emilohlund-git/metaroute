import { MetaRoute } from "@core/common";
import {
  AppConfiguration,
  EnvironmentConfigurator,
  ImportHandler,
  MetaRouteCore,
  ServerConfigurator,
} from "@core/configuration";
import { MemoryManager } from "@core/memory/memory-manager.core";
import { mock, instance, verify } from "ts-mockito";

describe("MetaRouteCore", () => {
  let environmentConfigurator: EnvironmentConfigurator;
  let serverConfigurator: ServerConfigurator;
  let memoryManager: MemoryManager;
  let metaRouteCore: MetaRouteCore;
  let appConfiguration: AppConfiguration;

  beforeEach(() => {
    environmentConfigurator = mock(EnvironmentConfigurator);
    serverConfigurator = mock(ServerConfigurator);
    appConfiguration = mock(appConfiguration);

    metaRouteCore = new MetaRouteCore(
      instance(environmentConfigurator),
      instance(serverConfigurator)
    );
  });

  it("should call setup on all dependencies", async () => {
    await metaRouteCore.setup(instance(appConfiguration));

    verify(environmentConfigurator.setup()).once();
    verify(serverConfigurator.setup(instance(appConfiguration))).once();

    await metaRouteCore.setup(instance(appConfiguration));
  });

  it("should call setup on ImportHandler if it is in the initializers", async () => {
    const mockImportHandler = { setup: jest.fn() };
    jest.spyOn(MetaRoute, "resolve").mockReturnValue(mockImportHandler);

    const appConfigurationWithImportHandler: AppConfiguration = {
      initializers: [{ name: ImportHandler.name } as any],
    };

    await metaRouteCore.setup(appConfigurationWithImportHandler);

    expect(mockImportHandler.setup).toHaveBeenCalled();
  });

  it("should call setup on other configurators if they are in the initializers", async () => {
    const mockConfigurator = { setup: jest.fn() };
    jest.spyOn(MetaRoute, "resolve").mockReturnValue(mockConfigurator);

    const appConfigurationWithOtherConfigurator: AppConfiguration = {
      initializers: [{ name: "OtherConfigurator" } as any],
    };

    await metaRouteCore.setup(appConfigurationWithOtherConfigurator);

    expect(mockConfigurator.setup).toHaveBeenCalled();
  });
});
