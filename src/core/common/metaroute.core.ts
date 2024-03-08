import "reflect-metadata";

import { EnvironmentConfigurator } from "./environment-configurator.core";
import { CodeFirstConfigurator } from "../code-first/code-first-configurator.core";
import { ServerConfigurator } from "./server-configurator.core";
import { Initializable } from "./interfaces/initializable.interface";
import { MemoryManager } from "../memory/memory-manager.core";
import { AppConfiguration } from "./interfaces/app-configuration.interface";
import { ImportHandler } from "./import-handler.core";

export class MetaRouteCore implements Initializable {
  constructor(
    private readonly environmentConfigurator: EnvironmentConfigurator,
    private readonly importHandler: ImportHandler,
    private readonly codeFirstConfigurator: CodeFirstConfigurator,
    private readonly serverConfigurator: ServerConfigurator,
    private readonly memoryManager: MemoryManager
  ) {}

  public async setup(configuration: AppConfiguration) {
    await this.environmentConfigurator.setup();
    await this.importHandler.setup();
    await this.serverConfigurator.setup(configuration);
    await this.codeFirstConfigurator.setup();
    await this.memoryManager.setup();
  }
}
