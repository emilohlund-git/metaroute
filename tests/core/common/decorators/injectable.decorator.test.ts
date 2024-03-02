import { INJECTABLE_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { Injectable } from "@core/common/decorators/injectable.decorator";
import { MetaRoute } from "@core/common/meta-route.container";
import "reflect-metadata";

describe("Injectable Decorator", () => {
  class TestClass {}

  beforeEach(() => {
    jest.spyOn(MetaRoute, "register");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should define metadata", () => {
    Injectable(TestClass);

    expect(Reflect.getMetadata(INJECTABLE_METADATA_KEY, TestClass)).toEqual({});
  });

  it("should register target", () => {
    Injectable(TestClass);

    expect(MetaRoute.register).toHaveBeenCalledWith(TestClass);
  });
});
