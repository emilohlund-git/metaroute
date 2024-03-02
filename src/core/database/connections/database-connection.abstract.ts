/**
 * `DatabaseConnection` is an abstract class that represents a connection to a database.
 * It provides a common interface for opening and closing connections to a database.
 *
 * The actual implementation of how to open and close the connection is left to the subclasses.
 * This allows for different types of database connections (e.g., SQL, NoSQL) to be handled in a uniform way.
 *
 * Subclasses must implement the `openConnection` and `closeConnection` methods.
 *
 * The `_connection` protected property holds the actual connection object.
 * It can be accessed via the `connection` getter.
 *
 * Example usage:
 *
 * ```typescript
 * import { createPool } from "mysql2";
 * import { DatabaseConnection } from "../database-connection";
 * import { ConfigService } from "@src/domain/services/config.service";
 * import { Configurator } from "@src/utils/decorators/configurator.decorator";
 *
 * @Configurator
 * export class SqlDatabaseConnection extends DatabaseConnection {
 *   constructor(private readonly configService: ConfigService) {
 *     super();
 *   }
 *
 *   async openConnection(): Promise<void> {
 *     this._connection = createPool({
 *       host: this.configService.get("DB_HOST"),
 *       port: parseInt(this.configService.get("DB_PORT")),
 *       user: this.configService.get("DB_USER"),
 *       password: this.configService.get("DB_PASSWORD"),
 *       database: this.configService.get("DB_NAME"),
 *     });
 *   }
 *   async closeConnection(): Promise<void> {
 *     await this._connection.end();
 *   }
 * }
 * ```
 */
export abstract class DatabaseConnection {
  protected _connection: any;
  abstract openConnection(): Promise<void>;
  abstract closeConnection(): Promise<void>;
  get connection() {
    return this._connection;
  }
}
