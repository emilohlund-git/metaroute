import { DatabaseConnection } from "../connections/database-connection.abstract";
import { DatabaseCommand } from "../commands/database-command.abstract";
import { DatabaseResponse } from "../interfaces/database-response.interface";

/**
 * `DatabaseCommandExecutor` is an abstract class that represents a command executor for a database.
 * It provides a common interface for executing commands on a database.
 *
 * The actual implementation of how to execute the command is left to the subclasses.
 * This allows for different types of database command executors (e.g., SQL, NoSQL) to be handled in a uniform way.
 *
 * Subclasses must implement the `executeCommand` method.
 *
 * The `databaseConnection` protected property holds the `DatabaseConnection` object.
 * It can be used to interact with the database.
 *
 * Example usage:
 *
 * ```typescript
 * import { Configurator } from "@src/utils/decorators/configurator.decorator";
 * import { DatabaseCommand } from "../commands/database-command";
 * import { DatabaseCommandExecutor } from "../database-executor";
 * import { SqlDatabaseConnection } from "../connections/default.connection";
 *
 * @Configurator
 * export class SqlDatabaseCommandExecutor extends DatabaseCommandExecutor {
 *   constructor(databaseConnection: SqlDatabaseConnection) {
 *     super(databaseConnection);
 *   }
 *
 *   async executeCommand(command: DatabaseCommand): Promise<any> {
 *     const sql = command.generate();
 *
 *     try {
 *       return await this.databaseConnection.connection.promise().query(sql);
 *     } catch (error: any) {
 *       if (error.errno === 1062) {
 *         return false;
 *       }
 *
 *       throw new Error(error.message);
 *     }
 *   }
 * }
 * ```
 */
export abstract class DatabaseCommandExecutor {
  constructor(protected databaseConnection: DatabaseConnection) {}
  abstract executeCommand(
    command: DatabaseCommand
  ): Promise<DatabaseResponse<any>>;
}
