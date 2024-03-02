import { ENTITY_METADATA_KEY } from "../common/constants/metadata-keys.constants";
import { DatabaseConnection } from "./connections/database-connection.abstract";
import { DatabaseCommandExecutor } from "./executors/database-executor.abstract";
import { TableCreationException } from "./exceptions/table-creation.exception";
import { ColumnDecoratorInterface } from "../common/interfaces/column-decorator-properties.interface";
import { ConsoleLogger } from "../common/services/console-logger.service";
import { Crud } from "../common/interfaces/crud.interface";
import { TableNotFoundException } from "./exceptions/table-not-found.exception";
import { DatabaseResponse } from "./interfaces/database-response.interface";
import { Entity } from "../common/types";
import { DatabaseCommand } from "./commands";

export abstract class CodeFirstDatabase<T> implements Crud<T> {
  protected entityConstructor: new (...args: any[]) => any;

  protected readonly logger = new ConsoleLogger(CodeFirstDatabase.name);
  protected connection: DatabaseConnection;
  protected commandExecutor: DatabaseCommandExecutor;

  constructor(
    entityConstructor: new (...args: any[]) => any,
    connection: DatabaseConnection,
    commandExecutor: DatabaseCommandExecutor
  ) {
    this.entityConstructor = entityConstructor;
    this.connection = connection;
    this.commandExecutor = commandExecutor;
  }

  async save(entity: T): Promise<DatabaseResponse<T>> {
    const table = this.getTableForEntity();

    if (!table) {
      throw new TableNotFoundException("Table not found for entity");
    }

    try {
      const command: DatabaseCommand = {
        command: "",
        parameters: [],
        generate() {
          return "";
        },
      };

      return await this.commandExecutor.executeCommand(command);
    } catch (error: any) {
      this.logger.error(
        `Error saving entity: ${
          Object.getPrototypeOf(entity).constructor.name
        }: ${error.message}`
      );
      return { success: false, error: error.message };
    }
  }

  async find(criteria: Partial<T>): Promise<DatabaseResponse<T>> {
    const table = this.getTableForEntity();

    try {
      const command: DatabaseCommand = {
        command: "",
        parameters: [],
        generate() {
          return "";
        },
      };

      return await this.commandExecutor.executeCommand(command);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async findAll(): Promise<DatabaseResponse<T[]>> {
    const table = this.getTableForEntity();

    try {
      const command: DatabaseCommand = {
        command: "",
        parameters: [],
        generate() {
          return "";
        },
      };

      return await this.commandExecutor.executeCommand(command);
    } catch (error: any) {
      this.logger.error(
        `Error finding all entities: ${
          Object.getPrototypeOf(this.entityConstructor).constructor.name
        }`
      );
      return { success: false, error: error.message };
    }
  }

  async update(entity: T, id: number): Promise<DatabaseResponse<T>> {
    const table = this.getTableForEntity();

    try {
      const command: DatabaseCommand = {
        command: "",
        parameters: [],
        generate() {
          return "";
        },
      };

      return await this.commandExecutor.executeCommand(command);
    } catch (error: any) {
      this.logger.error(
        `Error updating entity: ${
          Object.getPrototypeOf(entity).constructor.name
        }`
      );
      return { success: false, error: error.message };
    }
  }

  async remove(id: number): Promise<DatabaseResponse<boolean>> {
    const table = this.getTableForEntity();

    try {
      const command: DatabaseCommand = {
        command: "",
        parameters: [],
        generate() {
          return "";
        },
      };

      return await this.commandExecutor.executeCommand(command);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createEntityTable(
    entity: Entity,
    properties: ColumnDecoratorInterface[]
  ) {
    try {
      const command: DatabaseCommand = {
        command: "",
        parameters: [],
        generate() {
          return "";
        },
      };

      await this.commandExecutor.executeCommand(command);
    } catch (error) {
      this.logger.error(
        `Error creating table for entity: ${entity.constructor.name}`
      );
      throw new TableCreationException(entity.constructor.name);
    }
  }

  protected getTableForEntity(): string {
    const metadata = Reflect.getMetadata(
      ENTITY_METADATA_KEY,
      this.entityConstructor
    );
    const tableName = metadata?.tableName;

    if (!tableName) {
      throw new TableNotFoundException("Table not found for entity");
    }

    return tableName;
  }
}
