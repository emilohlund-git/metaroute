import "reflect-metadata";
import { MetaRoute } from "@core/common/meta-route.container";
import { CONFIGURATOR_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { Configurator } from "@core/common/decorators/configurator.decorator";

class TestClass {}

describe("Configurator", () => {
  let registerSpy: jest.SpyInstance;

  beforeEach(() => {
    registerSpy = jest.spyOn(MetaRoute, "register");
  });

  afterEach(() => {
    registerSpy.mockRestore();
  });

  it("should define metadata and register target", () => {
    Configurator(TestClass);

    expect(Reflect.getMetadata(CONFIGURATOR_METADATA_KEY, TestClass)).toEqual(
      {}
    );

    expect(registerSpy).toHaveBeenCalledWith(TestClass);
  });
});
