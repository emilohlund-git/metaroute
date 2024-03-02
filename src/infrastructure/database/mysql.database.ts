import { ConfigService } from "@core/common/services/config.service";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { CodeFirstDatabase } from "@core/database/code-first-database.abstract";
import { SqlDatabaseConnection } from "@core/database/connections/sql.connector";
import { Database } from "@core/database/decorators/database.decorator";
import { SqlDatabaseCommandExecutor } from "@core/database/executors/sql.executor";

@Database
export class MysqlDatabase<T> extends CodeFirstDatabase<T> {
  protected readonly logger = new ConsoleLogger(MysqlDatabase.name);

  constructor(
    entityConstructor: new (...args: any[]) => any,
    protected readonly configService: ConfigService,
    protected readonly connection: SqlDatabaseConnection,
    protected readonly commandExecutor: SqlDatabaseCommandExecutor
  ) {
    super(entityConstructor, connection, commandExecutor);

    this.connection.openConnection();
  }
}
