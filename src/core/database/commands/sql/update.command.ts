import { DatabaseCommand } from "../database-command.abstract";

export class UpdateCommand extends DatabaseCommand {
  constructor(
    private tableName: string,
    private entity: any,
    private id: number
  ) {
    super();
  }

  generate(): string {
    const columns = Object.keys(this.entity)
      .map((key) => {
        const value =
          typeof this.entity[key] === "string"
            ? this.entity[key].replace(/'/g, "''")
            : this.entity[key];
        return `${key} = '${value}'`;
      })
      .join(", ");
    return `UPDATE ${this.tableName} SET ${columns} WHERE id = ${this.id}`;
  }
}
