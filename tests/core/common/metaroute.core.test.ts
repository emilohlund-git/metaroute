import { CodeFirstConfigurator } from "@core/code-first/code-first-configurator.core";
import { EnvironmentConfigurator } from "@core/common/environment-configurator.core";
import { AppConfiguration } from "@core/common/interfaces/app-configuration.interface";
import { MetaRouteCore } from "@core/common/metaroute.core";
import { ServerConfigurator } from "@core/common/server-configurator.core";
import { MemoryManager } from "@core/memory/memory-manager.core";
import { ImportHandler } from "src";
import { mock, instance, when, verify } from "ts-mockito";

describe("MetaRouteCore", () => {
  let environmentConfigurator: EnvironmentConfigurator;
  let codeFirstConfigurator: CodeFirstConfigurator;
  let serverConfigurator: ServerConfigurator;
  let importHandler: ImportHandler;
  let memoryManager: MemoryManager;
  let metaRouteCore: MetaRouteCore;
  let appConfiguration: AppConfiguration;

  beforeEach(() => {
    importHandler = mock(ImportHandler);
    environmentConfigurator = mock(EnvironmentConfigurator);
    codeFirstConfigurator = mock(CodeFirstConfigurator);
    serverConfigurator = mock(ServerConfigurator);
    memoryManager = mock(MemoryManager);
    appConfiguration = mock(appConfiguration);

    metaRouteCore = new MetaRouteCore(
      instance(importHandler),
      instance(environmentConfigurator),
      instance(codeFirstConfigurator),
      instance(serverConfigurator),
      instance(memoryManager)
    );
  });

  it("should call setup on all dependencies", async () => {
    await metaRouteCore.setup(instance(appConfiguration));

    verify(environmentConfigurator.setup()).once();
    verify(serverConfigurator.setup(instance(appConfiguration))).once();
    verify(codeFirstConfigurator.setup()).once();
    verify(memoryManager.setup()).once();
  });
});
