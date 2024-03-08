import "reflect-metadata";
import { MetaRoute } from "../meta-route.container";
import { AppConfiguration } from "../interfaces/app-configuration.interface";
import { MetaRouteCore } from "../metaroute.core";
import { Application } from "../interfaces/application.interface";
import { ApplicationConstructor } from "../types";

export function App(config: AppConfiguration): ClassDecorator {
  return function (target: Function) {
    if (!(target.prototype instanceof Application)) {
      throw new TypeError("Class decorated with @App must extend Application");
    }
    
    const app = target as ApplicationConstructor;

    app.prototype.appConfig = config;

    const core = MetaRoute.resolve(MetaRouteCore);
    const application = new app(core);
    application.start();
  };
}
