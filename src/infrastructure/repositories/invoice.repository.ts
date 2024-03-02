import { CodeFirstRepository } from "@core/code-first/services/code-first.repository";
import { Repository } from "@core/common/decorators/repository.decorator";
import { MysqlDatabase } from "../database/mysql.database";
import { Invoice } from "src/domain/entities/invoice.entity";
import { ConfigService } from "@core/common/services/config.service";
import { SqlDatabaseConnection } from "@core/database/connections/sql.connector";
import { SqlDatabaseCommandExecutor } from "@core/database/executors/sql.executor";

@Repository
export class InvoiceRepository extends CodeFirstRepository<Invoice> {
  constructor(
    private readonly configService: ConfigService,
    private readonly connection: SqlDatabaseConnection,
    private readonly executor: SqlDatabaseCommandExecutor
  ) {
    const db = new MysqlDatabase<Invoice>(
      Invoice,
      configService,
      connection,
      executor
    );
    super(db);
  }
}
