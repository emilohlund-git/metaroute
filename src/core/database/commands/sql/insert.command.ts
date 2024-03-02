import { DatabaseCommand } from "../database-command.abstract";

export class InsertCommand<T> extends DatabaseCommand {
  constructor(private tableName: string, private entity: T) {
    super();
  }

  generate(): string {
    const entries = Object.entries(this.entity as any).filter(
      ([key, value]) => value !== undefined && value !== null
    );

    const columns = entries.map(([key]) => key).join(", ");
    const values = entries
      .map(([, value]) => (typeof value === "string" ? `'${value}'` : value))
      .join(", ");

    return `INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`;
  }
}
