import { ENTITY_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { MetaRoute } from "@core/common/meta-route.container";
import { DatabaseEntity } from "@core/database/decorators/database-entity.decorator";
import "reflect-metadata";

describe("DatabaseEntity decorator", () => {
  it("should define metadata for the target", () => {
    @DatabaseEntity()
    class TestEntity {}

    const metadata = Reflect.getMetadata(ENTITY_METADATA_KEY, TestEntity);
    expect(metadata).toBeDefined();
    expect(metadata.tableName).toBe("TESTENTITY");
  });

  it("should register the target in MetaRoute", () => {
    const spy = jest.spyOn(MetaRoute, "register");

    @DatabaseEntity()
    class TestEntity {}

    expect(spy).toHaveBeenCalledWith(TestEntity);
  });
});
