import { mock, instance, verify, anyString } from "ts-mockito";
import "reflect-metadata";
import { CodeFirstConfigurator } from "@core/code-first/code-first-configurator.core";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { CodeFirstDatabase } from "@core/database/code-first-database.abstract";
import { MetaRoute } from "@core/common/meta-route.container";
import { DatabaseTableException } from "@core/database/exceptions/database-table.exception";
import { DATABASE_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { ColumnDecoratorInterface } from "@core/common/interfaces/column-decorator-properties.interface";
import { Entity } from "@core/common/types";
import { DatabaseConnection } from "@core/database/database-connection.abstract";
import { DatabaseCommandExecutor } from "@core/database/database-executor.abstract";
import { DatabaseEntity } from "@core/database/decorators/database-entity.decorator";
import { Column } from "@core/database/decorators/column.decorator";
import { TableCreationException } from "@core/database/exceptions/table-creation.exception";

@DatabaseEntity()
class TestEntity {
  @Column()
  id: number;
}

class TestDatabase extends CodeFirstDatabase<any> {
  createEntityTable(
    entity: Entity,
    properties: ColumnDecoratorInterface[]
  ): Promise<void> {
    return Promise.resolve();
  }
}

describe("CodeFirstConfigurator", () => {
  let configurator: CodeFirstConfigurator;
  let logger: ConsoleLogger;
  let database: CodeFirstDatabase<any>;

  beforeEach(() => {
    logger = mock(ConsoleLogger);
    database = mock(CodeFirstDatabase);
    configurator = new CodeFirstConfigurator();
    (configurator as any).logger = instance(logger);
  });

  it("should setup without error when database instance exists", async () => {
    const databaseInstance = new TestDatabase(
      TestEntity,
      {} as DatabaseConnection,
      {} as DatabaseCommandExecutor
    );
    const entityInstance = new TestEntity();
    jest
      .spyOn(databaseInstance, "createEntityTable")
      .mockResolvedValue(undefined);
    Reflect.defineMetadata(
      DATABASE_METADATA_KEY,
      {},
      databaseInstance.constructor
    );
    const instances = [databaseInstance, entityInstance];
    jest.spyOn(MetaRoute, "getAllInstances").mockReturnValue(instances);

    await configurator.setup();

    verify(logger.error(anyString())).never();
  });

  it("should log error when error occurs during table creation", async () => {
    const databaseInstance = new TestDatabase(
      TestEntity,
      {} as DatabaseConnection,
      {} as DatabaseCommandExecutor
    );
    const entityInstance = new TestEntity();
    jest
      .spyOn(databaseInstance, "createEntityTable")
      .mockRejectedValue(new Error("Test error"));
    Reflect.defineMetadata(
      DATABASE_METADATA_KEY,
      {},
      databaseInstance.constructor
    );
    const instances = [databaseInstance, entityInstance];
    jest.spyOn(MetaRoute, "getAllInstances").mockReturnValue(instances);

    try {
      await configurator.setup();
    } catch (error) {
      // Expect the error to be a DatabaseTableException
      expect(error).toBeInstanceOf(DatabaseTableException);
    }

    verify(logger.error("Error creating database tables")).atLeast(1);
  });

  it("should throw DatabaseTableException when error occurs during table creation", async () => {
    const databaseInstance = new TestDatabase(
      TestEntity,
      {} as DatabaseConnection,
      {} as DatabaseCommandExecutor
    );
    const entityInstance = new TestEntity();
    jest
      .spyOn(databaseInstance, "createEntityTable")
      .mockImplementation(() =>
        Promise.reject(new TableCreationException("Test"))
      );
    Reflect.defineMetadata(
      DATABASE_METADATA_KEY,
      {},
      databaseInstance.constructor
    );
    const instances = [databaseInstance, entityInstance];
    jest.spyOn(MetaRoute, "getAllInstances").mockReturnValue(instances);

    await expect(configurator.setup()).rejects.toThrow(DatabaseTableException);
  });
});
