import "reflect-metadata";

import { EnvironmentConfigurator } from "./environment-configurator.core";
import { ServerConfigurator } from "./server-configurator.core";
import { Initializable } from "./interfaces/initializable.interface";
import { AppConfiguration } from "./interfaces/app-configuration.interface";
import { ImportHandler } from "./import-handler.core";
import { MetaRoute } from "./meta-route.container";
import { Injectable } from "./decorators/injectable.decorator";
import { Scope } from "./enums/scope.enum";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteCore implements Initializable {
  constructor(
    private readonly environmentConfigurator: EnvironmentConfigurator,
    private readonly serverConfigurator: ServerConfigurator
  ) {}

  public async setup(configuration: AppConfiguration) {
    await this.environmentConfigurator.setup();

    // Check if the import handler is in the configuration configurators array and if it is, set it up first.
    if (
      configuration.initializers &&
      configuration.initializers.length > 0 &&
      configuration.initializers?.some(
        (configurator) => configurator.name === ImportHandler.name
      )
    ) {
      const importHandler = MetaRoute.resolve(ImportHandler);
      await importHandler.setup();
    }

    await this.serverConfigurator.setup(configuration);

    // Set up the rest of the configurators.
    if (
      !configuration.initializers ||
      (configuration.initializers && configuration.initializers.length === 0)
    )
      return;

    for (const configurator of configuration.initializers || []) {
      if (configurator.name === ImportHandler.name) continue;
      MetaRoute.resolve(configurator).setup(configuration);
    }
  }
}
