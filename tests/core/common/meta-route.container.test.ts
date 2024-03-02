import { MetaRoute } from "@core/common/meta-route.container";
import "reflect-metadata";

describe("MetaRoute", () => {
  class TestClass {}

  beforeEach(() => {
    MetaRoute.register(TestClass);
  });

  afterEach(() => {
    // Reset instances after each test
    (MetaRoute as any).instances = new Map();
  });

  it("should register a class", () => {
    expect(MetaRoute.get(TestClass)).toBeInstanceOf(TestClass);
  });

  it("should resolve a class", () => {
    const instance = MetaRoute.resolve(TestClass);
    expect(instance).toBeInstanceOf(TestClass);
  });

  it("should get all instances", () => {
    const instances = MetaRoute.getAllInstances();
    expect(instances).toHaveLength(1);
    expect(instances[0]).toBeInstanceOf(TestClass);
  });

  it("should get all instances by decorator", () => {
    const decorator = Symbol("test");
    Reflect.defineMetadata(decorator, {}, TestClass);
    const instances = MetaRoute.getAllByDecorator(decorator);
    expect(instances).toHaveLength(1);
    expect(instances[0]).toBeInstanceOf(TestClass);
  });
});
