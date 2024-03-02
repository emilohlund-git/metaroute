import { InsertCommand } from "@core/database/commands/sql/insert.command";

describe("InsertCommand", () => {
  it("should generate correct SQL for string values", () => {
    const command = new InsertCommand("users", {
      name: "John",
      email: "john@example.com",
    });
    const sql = command.generate();
    expect(sql).toBe(
      "INSERT INTO users (name, email) VALUES ('John', 'john@example.com')"
    );
  });

  it("should generate correct SQL for numeric values", () => {
    const command = new InsertCommand("users", { id: 1, age: 30 });
    const sql = command.generate();
    expect(sql).toBe("INSERT INTO users (id, age) VALUES (1, 30)");
  });

  it("should ignore undefined and null values", () => {
    const command = new InsertCommand("users", {
      name: "John",
      email: undefined,
      age: null,
    });
    const sql = command.generate();
    expect(sql).toBe("INSERT INTO users (name) VALUES ('John')");
  });
});
