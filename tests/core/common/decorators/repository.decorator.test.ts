import { REPOSITORY_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { Repository } from "@core/common/decorators/repository.decorator";
import { MetaRoute } from "@core/common/meta-route.container";
import "reflect-metadata";

describe("Repository Decorator", () => {
    class TestClass {}
  
    beforeEach(() => {
      jest.spyOn(MetaRoute, "register");
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it("should define metadata", () => {
      Repository(TestClass);
  
      expect(Reflect.getMetadata(REPOSITORY_METADATA_KEY, TestClass)).toEqual({});
    });
  
    it("should register target", () => {
      Repository(TestClass);
  
      expect(MetaRoute.register).toHaveBeenCalledWith(TestClass);
    });
  });