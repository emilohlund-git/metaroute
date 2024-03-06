import { MetaRoute } from "@core/common/meta-route.container";
import "reflect-metadata";
import { Injectable } from "@core/common/decorators/injectable.decorator";
import { Scope } from "@core/common/enums/scope.enum";

describe("MetaRoute", () => {
  @Injectable({ scope: Scope.SINGLETON })
  class SingletonClass {}

  @Injectable({ scope: Scope.TRANSIENT })
  class TransientClass {}

  @Injectable({ scope: Scope.SINGLETON })
  class WithoutDependencies {}

  @Injectable({ scope: Scope.SINGLETON })
  class WithOneDependency {
    constructor(public dependency: WithoutDependencies) {}
  }

  @Injectable({ scope: Scope.SINGLETON })
  class NestedDependencies {
    constructor(public dependency: WithOneDependency) {}
  }

  @Injectable({ scope: Scope.TRANSIENT })
  class TransientClassWithDependencies {
    constructor(public dependency: NestedDependencies) {}
  }

  it("should register a singleton class", () => {
    expect(MetaRoute.get(SingletonClass)).toBeInstanceOf(SingletonClass);
  });

  it("should register a transient class", () => {
    expect(MetaRoute.get(TransientClass)).toBeInstanceOf(TransientClass);
  });

  it("should resolve a singleton class with the same instance each time", () => {
    const instance1 = MetaRoute.resolve(SingletonClass);
    const instance2 = MetaRoute.resolve(SingletonClass);
    expect(instance1).toBeInstanceOf(SingletonClass);
    expect(instance2).toBeInstanceOf(SingletonClass);
    expect(instance1).toStrictEqual(instance2);
  });

  it("should resolve a transient class with a new instance each time", () => {
    const instance1 = MetaRoute.resolve(TransientClass);
    const instance2 = MetaRoute.resolve(TransientClass);
    expect(instance1).toBeInstanceOf(TransientClass);
    expect(instance2).toBeInstanceOf(TransientClass);
    expect(instance1).not.toBe(instance2);
  });

  it("should throw an error when trying to get an unregistered class", () => {
    class UnregisteredClass {}
    expect(() => MetaRoute.get(UnregisteredClass)).toThrow();
  });

  it("should get all instances by scope", () => {
    const singletonInstances = MetaRoute.getAllByScope(Scope.SINGLETON);
    expect(singletonInstances).toHaveLength(4);
    expect(singletonInstances[0]).toBeInstanceOf(SingletonClass);

    const transientInstances = MetaRoute.getAllByScope(Scope.TRANSIENT);
    expect(transientInstances).toHaveLength(2);
    expect(transientInstances[0]).toBeInstanceOf(TransientClass);
  });

  it("should resolve a class", () => {
    const instance = MetaRoute.resolve(SingletonClass);
    expect(instance).toBeInstanceOf(SingletonClass);
  });

  it("should get all instances", () => {
    const instances = MetaRoute.getAllInstances();
    expect(instances).toHaveLength(6);
    expect(instances[0]).toBeInstanceOf(SingletonClass);
  });

  describe("Nested Dependencies", () => {
    it("should inject nested dependencies", () => {
      const instance = MetaRoute.resolve(TransientClassWithDependencies);
      expect(instance).toBeInstanceOf(TransientClassWithDependencies);
      expect(instance.dependency).toBeInstanceOf(NestedDependencies);
      expect(instance.dependency.dependency).toBeInstanceOf(WithOneDependency);
      expect(instance.dependency.dependency.dependency).toBeInstanceOf(
        WithoutDependencies
      );
    });
  });
});
