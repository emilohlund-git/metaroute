import { createPool } from "mysql2";
import { DatabaseConnection } from "../database-connection.abstract";
import { Configurator } from "../../common/decorators/configurator.decorator";
import { ConfigService } from "../../common/services/config.service";
import { DatabaseConnectionException } from "../exceptions/database-connection.exception";

@Configurator
export class SqlDatabaseConnection extends DatabaseConnection {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async openConnection(): Promise<void> {
    try {
      this._connection = createPool({
        host: this.configService.get("DB_HOST"),
        port: parseInt(this.configService.get("DB_PORT")),
        user: this.configService.get("DB_USER"),
        password: this.configService.get("DB_PASSWORD"),
        database: this.configService.get("DB_NAME"),
      });
    } catch (error: any) {
      throw new DatabaseConnectionException(error.message);
    }
  }
  async closeConnection(): Promise<void> {
    await this._connection.end();
  }
}
