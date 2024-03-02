import { DatabaseCommand } from "../database-command.abstract";

export class RemoveCommand<T> extends DatabaseCommand {
  constructor(
    private tableName: string,
    private id: number
  ) {
    super();
  }

  generate(): string {
    return `DELETE FROM ${this.tableName} WHERE ID = ${this.id}`;
  }
}
