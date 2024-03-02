import { ColumnDecoratorInterface } from "@core/common/interfaces/column-decorator-properties.interface";
import { CreateTableCommand } from "@core/database/commands/sql/create-table.command";

describe("CreateTableCommand", () => {
  let createTableCommand: CreateTableCommand;

  beforeEach(() => {
    const entityName = "TestEntity";
    const properties: ColumnDecoratorInterface[] = [
      { key: "id", type: "number", isPrimary: true, isUnique: true },
      { key: "name", type: "string", isPrimary: false, isUnique: false },
      { key: "description", type: "text", isPrimary: false, isUnique: false },
      { key: "isActive", type: "boolean", isPrimary: false, isUnique: false },
      {
        key: "unknownType",
        type: "unknown",
        isPrimary: false,
        isUnique: false,
      },
    ];
    createTableCommand = new CreateTableCommand(entityName, properties);
  });

  it("should generate a valid SQL command", () => {
    const sqlCommand = createTableCommand.generate();
    expect(sqlCommand).toBe(
      "CREATE TABLE IF NOT EXISTS TestEntity (id INT PRIMARY KEY AUTO_INCREMENT UNIQUE, name VARCHAR(255), description TEXT, isActive BOOLEAN, unknownType VARCHAR(255))"
    );
  });

  it("should convert TypeScript types to SQL types", () => {
    const sqlTypes = ["INT", "VARCHAR(255)", "TEXT", "BOOLEAN", "VARCHAR(255)"];
    const properties = createTableCommand["properties"];
    properties.forEach(
      (
        property: {
          type: string;
        },
        index: number
      ) => {
        const sqlType = createTableCommand["typeScriptToSqlType"](
          property.type
        );
        expect(sqlType).toBe(sqlTypes[index]);
      }
    );
  });
});
