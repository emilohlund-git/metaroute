import "reflect-metadata";
import { MetaRoute } from "../meta-route.container";
import { AppConfiguration } from "../interfaces/app-configuration.interface";
import { MetaRouteCore } from "../metaroute.core";
import { Application } from "../interfaces/application.interface";
import { ApplicationConstructor } from "../types";
import { ImportHandler } from "../import-handler.core";
import { EnvironmentConfigurator } from "../environment-configurator.core";
import {
  CodeFirstConfigurator,
  MemoryManager,
  ServerConfigurator,
} from "../..";

export function App(config: AppConfiguration): ClassDecorator {
  return function (target: Function) {
    if (!(target.prototype instanceof Application)) {
      throw new TypeError("Class decorated with @App must extend Application");
    }

    const app = target as ApplicationConstructor;

    app.prototype.appConfig = config;

    const environmentConfigurator = MetaRoute.resolve(EnvironmentConfigurator);
    const importHandler = MetaRoute.resolve(ImportHandler);
    const codeFirstConfigurator = MetaRoute.resolve(CodeFirstConfigurator);
    const serverConfigurator = MetaRoute.resolve(ServerConfigurator);
    const memoryManager = MetaRoute.resolve(MemoryManager);

    const core = new MetaRouteCore(
      environmentConfigurator,
      importHandler,
      codeFirstConfigurator,
      serverConfigurator,
      memoryManager
    );

    const application = new app(core);
    application.start();
  };
}
