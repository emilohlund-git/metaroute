import { INJECTABLE_METADATA_KEY } from "@core/common";
import { Injectable } from "@core/common/decorators/injectable.decorator";
import { Scope } from "@core/common/enums/scope.enum";
import { MetaRoute } from "@core/common/meta-route.container";
import "reflect-metadata";

describe("Injectable Decorator", () => {
  beforeEach(() => {
    jest.spyOn(MetaRoute, "register");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should define metadata", () => {
    @Injectable({ scope: Scope.CONFIGURATOR })
    class TestClass {}

    expect(Reflect.getMetadata(INJECTABLE_METADATA_KEY, TestClass)).toEqual({
      scope: Scope.CONFIGURATOR,
    });
  });

  it("should register target", () => {
    @Injectable()
    class TestClass {}

    expect(MetaRoute.register).toHaveBeenCalledWith(TestClass);
  });
});
