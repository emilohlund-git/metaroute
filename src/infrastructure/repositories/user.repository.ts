import { CodeFirstRepository } from "@core/code-first/services/code-first.repository";
import { Repository } from "@core/common/decorators/repository.decorator";
import { User } from "src/domain/entities/user.entity";
import { MysqlDatabase } from "../database/mysql.database";
import { ConfigService } from "@core/common/services/config.service";
import { SqlDatabaseConnection } from "@core/database/connections/sql.connector";
import { SqlDatabaseCommandExecutor } from "@core/database/executors/sql.executor";

@Repository
export class UserRepository extends CodeFirstRepository<User> {
  constructor(
    private readonly configService: ConfigService,
    private readonly connection: SqlDatabaseConnection,
    private readonly executor: SqlDatabaseCommandExecutor
  ) {
    const db = new MysqlDatabase<User>(
      User,
      configService,
      connection,
      executor
    );
    super(db);
  }
}
