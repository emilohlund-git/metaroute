import "reflect-metadata";
import { MetaRoute } from "@core/common/meta-route.container";
import { Injectable } from "src";
import { Scope } from "@core/common/enums/scope.enum";

describe("Configurator", () => {
  let registerSpy: jest.SpyInstance;

  beforeEach(() => {
    registerSpy = jest.spyOn(MetaRoute, "register");
  });

  afterEach(() => {
    registerSpy.mockRestore();
  });

  it("should define metadata and register target", () => {
    @Injectable({ scope: Scope.CONFIGURATOR })
    class TestClass {}

    const configurator = MetaRoute.resolve(TestClass);

    expect(configurator).toBeInstanceOf(TestClass);

    expect(registerSpy).toHaveBeenCalledWith(TestClass);
  });
});
