import { DATABASE_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { MetaRoute } from "@core/common/meta-route.container";
import { Database } from "@core/database/decorators/database.decorator";
import "reflect-metadata";

describe("Database Decorator", () => {
  class TestClass {}

  beforeEach(() => {
    MetaRoute.register = jest.fn();
  });

  it("should define metadata for the target", () => {
    Database(TestClass);
    const metadata = Reflect.getMetadata(DATABASE_METADATA_KEY, TestClass);
    expect(metadata).toBeDefined();
  });

  it("should register the target in MetaRoute", () => {
    Database(TestClass);
    expect(MetaRoute.register).toHaveBeenCalledWith(TestClass);
  });
});
