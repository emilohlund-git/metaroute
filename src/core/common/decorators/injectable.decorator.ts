import "reflect-metadata";
import { InjectableOptions } from "../interfaces/injectable-options.interface";
import { MetaRoute } from "../meta-route.container";
import { ServiceIdentifier } from "../types";
import { INJECTABLE_METADATA_KEY } from "../constants";

export function Injectable(options?: InjectableOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, options, target);
    MetaRoute.register(target as ServiceIdentifier<Function>);
  };
}
