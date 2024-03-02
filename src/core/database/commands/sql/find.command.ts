import { DATABASE_COLUMN_METADATA_KEY } from "../../../common/constants/metadata-keys.constants";
import { DatabaseCommand } from "../database-command.abstract";
import { ColumnDecoratorInterface } from "../../../common/interfaces/column-decorator-properties.interface";

export class FindCommand<T> extends DatabaseCommand {
  constructor(private tableName: string, private entity: any) {
    super();
  }

  generate(): string {
    let whereClause: string = '';
    for (const [property, value] of Object.entries(this.entity)) {
      whereClause += `${property} = '${value}';`;
    }      
    return `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;
  }
}
