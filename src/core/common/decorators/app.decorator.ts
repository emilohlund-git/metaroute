import "reflect-metadata";
import { MetaRoute } from "../meta-route.container";
import { AppConfiguration } from "../interfaces/app-configuration.interface";
import { MetaRouteCore } from "../metaroute.core";

export function App(config: AppConfiguration): ClassDecorator {
  return (target: any) => {
    target.prototype.appConfig = config;

    const core = MetaRoute.resolve(MetaRouteCore);
    const application = new target(core);
    application.start();
  };
}
