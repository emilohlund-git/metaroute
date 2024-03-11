import "reflect-metadata";

import { MetaRoute } from "@core/common/meta-route.container";
import TestClass from "tests/utils/test-class.util";
import { CONTROLLER_METADATA_KEY } from "@core/common/constants";
import { Controller } from "@api/decorators/controller.decorator";

describe("Controller Decorator", () => {
  it("should set metadata for a class and call MetaRoute.register", () => {
    const registerSpy = jest.spyOn(MetaRoute, "register");
    Controller("/test")(TestClass);

    const metadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, TestClass);
    expect(metadata).toBe("/test");
    expect(registerSpy).toHaveBeenCalledWith(TestClass);
  });
});
