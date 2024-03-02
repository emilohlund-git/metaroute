import { DatabaseCommand } from "../database-command.abstract";

export class FindAllCommand<T> extends DatabaseCommand {
  constructor(private tableName: string) {
    super();
  }

  generate(): string {
    return `SELECT * FROM ${this.tableName}`;
  }
}
