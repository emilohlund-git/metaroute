import { DatabaseCommand } from "../commands/database-command.abstract";
import { DatabaseCommandExecutor } from "../database-executor.abstract";
import { SqlDatabaseConnection } from "../connections/sql.connector";
import { DatabaseResponse } from "../interfaces/database-response.interface";
import { Configurator } from "../../common/decorators/configurator.decorator";

@Configurator
export class SqlDatabaseCommandExecutor extends DatabaseCommandExecutor {
  constructor(databaseConnection: SqlDatabaseConnection) {
    super(databaseConnection);
  }

  async executeCommand(
    command: DatabaseCommand
  ): Promise<DatabaseResponse<any>> {
    const sql = command.generate();
    try {
      const result = await this.databaseConnection.connection
        .promise()
        .query(sql);

      if (result[0].length === 0) {
        return {
          success: false,
          error: "No results found",
        };
      } else if (result[0].length === 1) {
        return {
          success: true,
          data: result[0][0],
        };
      } else {
        return {
          success: true,
          data: result[0],
        };
      }
    } catch (error: any) {
      if (error.errno === 1062) {
        return {
          success: false,
          error: "Duplicate entry found in database",
        };
      }

      throw new Error(error.message);
    }
  }
}
