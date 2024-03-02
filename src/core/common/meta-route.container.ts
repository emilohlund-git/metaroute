import "reflect-metadata";

export class MetaRoute {
  private static instances = new Map();

  static register<T>(
    target: new (...args: unknown[]) => T,
    useClass?: new (...args: unknown[]) => T
  ) {
    const params: (new () => unknown)[] =
      Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = params.map((token: new () => unknown) =>
      MetaRoute.resolve(token)
    );
    const instance = new (useClass || target)(...injections);
    MetaRoute.instances.set(target, instance);
  }

  static resolve<T>(target: new (...args: any[]) => T): T {
    let instance = MetaRoute.instances.get(target);
    if (!instance) {
      const params: any[] =
        Reflect.getMetadata("design:paramtypes", target) || [];
      const injections = params.map((token: any) => MetaRoute.resolve(token));
      instance = new target(...injections);
      MetaRoute.instances.set(target, instance);
    }
    return instance;
  }

  static get<T>(type: new (...args: any[]) => T): T {
    return MetaRoute.instances.get(type);
  }

  static getAllInstances(): object[] {
    return Array.from(this.instances.values());
  }

  static getAllByDecorator<T>(decorator: Symbol): T[] {
    const instances = MetaRoute.instances.values();
    const filteredInstances = Array.from(instances).filter((instance) =>
      Reflect.getMetadata(decorator, instance.constructor)
    );

    return filteredInstances as T[];
  }
}
