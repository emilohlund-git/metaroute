import { EnvironmentConfigurator } from "@core/common/environment-configurator.core";
import { AppConfiguration } from "@core/common/interfaces/app-configuration.interface";
import { MetaRouteCore } from "@core/common/metaroute.core";
import { ServerConfigurator } from "@core/common/server-configurator.core";
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
});
