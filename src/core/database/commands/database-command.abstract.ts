/**
 * `DatabaseCommand` is an abstract class that represents a command to be executed on a database.
 * It provides a common interface for generating commands.
 * 
 * The actual implementation of how to generate the command is left to the subclasses.
 * This allows for different types of database commands (e.g., CREATE, SELECT, UPDATE, DELETE) to be handled in a uniform way.
 * 
 * While the example provided is for SQL, this class is not limited to SQL. It can be used to generate commands for any type of database.
 * The specific command syntax and structure would depend on the database system being used.
 * 
 * Subclasses must implement the `generate` method.
 * 
 * The `command` property holds the command as a string.
 * The `parameters` property holds any parameters for the command as a record of key-value pairs.
 * 
 * Example usage (SQL):
 * 
 * ```typescript
 * import { ColumnDecoratorInterface } from "@src/utils/interfaces/column-decorator-properties.interface";
 * import { DatabaseCommand } from "../database-command";
 * 
 * export class CreateTableCommand extends DatabaseCommand {
 *   constructor(
 *     private entityName: string,
 *     private properties: ColumnDecoratorInterface[]
 *   ) {
 *     super();
 *   }
 * 
 *   generate(): string {
 *     const columns = this.properties
 *       .map(
 *         (p) =>
 *           `${p.key} ${this.typeScriptToSqlType(p.type)}${
 *             p.isPrimary ? " PRIMARY KEY AUTO_INCREMENT" : ""
 *           }${p.isUnique ? " UNIQUE" : ""}`
 *       )
 *       .join(", ");
 * 
 *     return `CREATE TABLE IF NOT EXISTS ${this.entityName} (${columns})`;
 *   }
 * 
 *   private typeScriptToSqlType(typeScriptType: string): string {
 *     switch (typeScriptType) {
 *       case "string":
 *         return "VARCHAR(255)";
 *       case "number":
 *         return "INT";
 *       case "boolean":
 *         return "BOOLEAN";
 *       default:
 *         return "VARCHAR(255)"; // Default type
 *     }
 *   }
 * }
 * ```
 */
export abstract class DatabaseCommand {
  command: string;
  parameters: Record<string, any>;

  abstract generate(): string;
}
