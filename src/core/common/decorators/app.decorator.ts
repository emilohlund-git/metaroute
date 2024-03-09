import "reflect-metadata";
import { MetaRoute } from "../meta-route.container";
import { AppConfiguration } from "../interfaces/app-configuration.interface";
import { MetaRouteCore } from "../metaroute.core";
import { Application } from "../interfaces/application.interface";
import { ApplicationConstructor } from "../types";
import { ConsoleLogger } from "../services";
import { LogLevel } from "../enums";

export function App(config: AppConfiguration): ClassDecorator {
  return function (target: Function) {
    if (!(target.prototype instanceof Application)) {
      throw new TypeError("Class decorated with @App must extend Application");
    }

    const app = target as ApplicationConstructor;

    app.prototype.appConfig = config;

    const core = MetaRoute.resolve(MetaRouteCore);

    if (config.logging) {
      const logger = MetaRoute.resolve(ConsoleLogger);
      if (config.logging.level) {
        logger.setMinLevel(config.logging.level);
      } else {
        logger.setMinLevel(LogLevel.INFO);
      }
      config.logging.format && logger.setFormat(config.logging.format);
    }

    const application = new app(core);
    application.start();
  };
}
