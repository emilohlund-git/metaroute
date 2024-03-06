import { CodeFirstDatabase } from "../database/code-first-database.abstract";
import {
  DATABASE_COLUMN_METADATA_KEY,
  DATABASE_METADATA_KEY,
  ENTITY_METADATA_KEY,
} from "../common/constants/metadata-keys.constants";
import { MetaRoute } from "../common/meta-route.container";
import { Initializable } from "../common/interfaces/initializable.interface";
import { ConsoleLogger } from "../common/services/console-logger.service";
import { DatabaseTableException } from "../database/exceptions/database-table.exception";
import { Entity, ServiceIdentifier } from "../common/types";
import { Injectable } from "../common/decorators/injectable.decorator";
import { Scope } from "../common/enums/scope.enum";

@Injectable({ scope: Scope.CONFIGURATOR })
export class CodeFirstConfigurator implements Initializable {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(CodeFirstConfigurator.name);
  }

  async setup() {
    try {
      await this.createDatabaseTables();
    } catch (error) {
      this.logger.error("Error creating database tables");
      throw error;
    }
  }

  protected createDatabaseTables = async (): Promise<void> => {
    const instances = MetaRoute.getAllInstances();
    const databaseInstance = instances.find(
      (instance) =>
        Reflect.hasMetadata(DATABASE_METADATA_KEY, instance.constructor) &&
        instance instanceof CodeFirstDatabase
    ) as CodeFirstDatabase<Entity>;

    if (!databaseInstance) {
      return;
    }

    try {
      const entityInstances = instances.filter((instance) =>
        Reflect.hasMetadata(ENTITY_METADATA_KEY, instance.constructor)
      );

      await Promise.all(
        entityInstances.map((instance) =>
          this.createTableForEntity(
            databaseInstance,
            Object.getPrototypeOf(instance)
          )
        )
      );
    } catch (error: any) {
      this.logger.error("Error creating database tables");
      throw new DatabaseTableException(error.message);
    }
  };

  protected async createTableForEntity(
    database: CodeFirstDatabase<Entity>,
    instance: ServiceIdentifier<Entity>
  ) {
    const columns = Reflect.getMetadata(DATABASE_COLUMN_METADATA_KEY, instance);

    if (!columns) return;
    await database.createEntityTable(instance, columns);
  }
}
