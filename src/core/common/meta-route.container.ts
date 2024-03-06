import "reflect-metadata";
import {
  MetaRouteKey,
  NameBrand,
  ScopeBrand,
  ServiceIdentifier,
} from "./types";
import { INJECTABLE_METADATA_KEY } from "./constants";
import { Scope } from "./enums/scope.enum";
import { MetaRouteException } from "./exceptions";

/**
 * @author Emil Ölund
 *
 * @class MetaRoute
 *
 * @description A class that acts as a container for the application
 */
export class MetaRoute {
  /**
   * @property instances
   *
   * @type {Map<MetaRouteKey, ConstructorInstance>}
   *
   * @description A map of instances
   */
  private static instances: Map<MetaRouteKey, any> = new Map<
    MetaRouteKey,
    any
  >();

  private static resolving: Set<ServiceIdentifier<any>> = new Set();

  /**
   * @function register
   *
   * @param {ServiceIdentifier<T>} target
   * @param {ServiceIdentifier<T>} useClass
   * @returns {void}
   *
   * @description Registers a class to the container
   */
  static register<T>(
    target: ServiceIdentifier<T>,
    useClass?: ServiceIdentifier<T>
  ): void {
    const metadata = Reflect.getMetadata(
      INJECTABLE_METADATA_KEY,
      useClass || target
    );

    if (!metadata) return;

    const instance = MetaRoute.createInstance(useClass || target);
    const key = MetaRoute.getKey(target, metadata.scope);

    MetaRoute.instances.set(key, instance);
  }

  /**
   * @function resolve
   *
   * @param {ServiceIdentifier<T>} target
   * @returns {T}
   *
   * @description Resolves a class from the container
   */
  static resolve<T>(target: ServiceIdentifier<T>): T {
    const metadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
    const scope = metadata && metadata.scope ? metadata.scope : Scope.TRANSIENT;
    const key = MetaRoute.getKey(target, scope);

    if (scope === Scope.TRANSIENT) {
      return MetaRoute.createInstance(target);
    }

    let instance = MetaRoute.instances.get(key);

    if (!instance) {
      throw new MetaRouteException(`
        No instance found for ${target.name}. Did you forget to register it?
      `);
    }

    return instance;
  }

  /**
   * @function get
   *
   * @param type
   * @returns {T}
   *
   * @description Gets an instance from the container
   */
  static get<T>(target: ServiceIdentifier<T>): T {
    const metadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
    const key = MetaRoute.getKey(target, metadata.scope);
    const instance = MetaRoute.instances.get(key);

    if (!instance) {
      throw new MetaRouteException(
        `No instance found for ${target.name}. Did you forget to register it?`
      );
    }

    return instance;
  }

  /**
   * @function getAllInstances
   *
   * @returns {object[]}
   *
   * @description Gets all instances from the container
   */
  static getAllInstances(): object[] {
    return Array.from(this.instances.values());
  }

  /**
   * @function getAllByScope
   *
   * @param {Scope} scope
   * @returns {T[]}
   *
   * @description Gets all instances from the container by scope
   */
  static getAllByScope<T>(scope: Scope): T[] {
    const instances = MetaRoute.instances.values();

    const filteredInstances = Array.from(instances).filter((instance) => {
      const metadata = Reflect.getMetadata(
        INJECTABLE_METADATA_KEY,
        instance.constructor
      );
      return metadata && metadata.scope === scope;
    });

    return filteredInstances;
  }

  /**
   * @function clear
   *
   * @returns {void}
   *
   * @description Clears the container
   */
  static clear(): void {
    MetaRoute.instances.clear();
  }

  /**
   * @function getKey
   *
   * @param {ServiceIdentifier<any>} target
   * @param {Scope} scope
   * @returns {MetaRouteKey}
   *
   * @description Gets a key for the container
   */
  private static getKey(
    target: ServiceIdentifier<any>,
    scope?: Scope
  ): MetaRouteKey {
    const nameBrand: NameBrand = target.name as NameBrand;
    if (scope !== undefined) {
      const scopeBrand: ScopeBrand = scope as ScopeBrand;
      return `${nameBrand}_${scopeBrand}`;
    }
    return nameBrand;
  }

  /**
   * @function createInstance
   *
   * @param {ServiceIdentifier<T>} target
   * @returns {T}
   *
   * @description Creates a new instance of a class
   */
  private static createInstance<T>(target: ServiceIdentifier<T>): T {
    if (this.resolving.has(target)) {
      throw new MetaRouteException(
        `Circular dependency detected: ${target.name}`
      );
    }

    this.resolving.add(target);

    const params: any[] =
      Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = params.map((token: any) => MetaRoute.resolve(token));

    this.resolving.delete(target);

    return new target(...injections);
  }
}