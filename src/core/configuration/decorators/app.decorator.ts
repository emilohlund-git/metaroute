import "reflect-metadata";
import { MetaRoute } from "../../common/meta-route.container";
import { AppConfiguration } from "../interfaces/app-configuration.interface";
import { MetaRouteCore } from "../metaroute.core";
import { Application } from "../application.abstract";
import { ApplicationConstructor } from "../../common/types";
import { MetaRouteException } from "../../common/exceptions/meta-route.exception";

export function App(config: AppConfiguration): ClassDecorator {
  return function (target: Function) {
    if (!(target.prototype instanceof Application)) {
      throw new MetaRouteException(
        "Class decorated with @App must extend Application"
      );
    }

    const app = target as ApplicationConstructor;

    app.prototype.appConfig = config;

    const core = MetaRoute.resolve(MetaRouteCore);

    const application = new app(core);
    application.start();
  };
}
