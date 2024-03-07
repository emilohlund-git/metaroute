/**
 * @enum {Scope}
 *
 * @description Enum for the MetaRoute container scopes.
 */
export enum Scope {
  /**
   * SINGLETON scope means that a single instance of the class will be created, and that single instance
   * will be used every time a dependency on this class needs to be resolved. This is useful for services
   * that hold some kind of internal state that needs to be shared across the application.
   */
  SINGLETON = 1,

  /**
   * TRANSIENT scope means that a new instance of the class will be created each time a dependency on this
   * class needs to be resolved. This is useful for services that don't hold any internal state, or services
   * where each consumer needs a separate instance.
   */
  TRANSIENT = 2,

  /**
   * MEMORY_POLICY scope is a group name for all classes that are used to manage memory in the application.
   */
  MEMORY_POLICY = 3,

  /**
   * CONFIGURATOR scope is a group name for all classes that are used to configure the application.
   */
  CONFIGURATOR = 4,
}
