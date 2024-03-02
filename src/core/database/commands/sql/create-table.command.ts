import { ColumnDecoratorInterface } from "../../../common/interfaces/column-decorator-properties.interface";
import { DatabaseCommand } from "../database-command.abstract";

export class CreateTableCommand extends DatabaseCommand {
  constructor(
    private entityName: string,
    private properties: ColumnDecoratorInterface[]
  ) {
    super();
  }

  generate(): string {
    const columns = this.properties
      .map(
        (p) =>
          `${p.key} ${this.typeScriptToSqlType(p.type)}${
            p.isPrimary ? " PRIMARY KEY AUTO_INCREMENT" : ""
          }${p.isUnique ? " UNIQUE" : ""}`
      )
      .join(", ");

    return `CREATE TABLE IF NOT EXISTS ${this.entityName} (${columns})`;
  }

  private typeScriptToSqlType(typeScriptType: string): string {
    switch (typeScriptType) {
      case "string":
        return "VARCHAR(255)";
      case "text":
        return "TEXT";
      case "number":
        return "INT";
      case "boolean":
        return "BOOLEAN";
      default:
        return "VARCHAR(255)"; // Default type
    }
  }
}
