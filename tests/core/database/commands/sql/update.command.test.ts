import { UpdateCommand } from "@core/database/commands/sql/update.command";

describe("UpdateCommand", () => {
  it("should generate correct SQL for single field update", () => {
    const command = new UpdateCommand("users", { name: "John Doe" }, 1);
    const sql = command.generate();
    expect(sql).toBe("UPDATE users SET name = 'John Doe' WHERE id = 1");
  });

  it("should generate correct SQL for multiple fields update", () => {
    const command = new UpdateCommand(
      "users",
      { name: "John Doe", age: 30 },
      1
    );
    const sql = command.generate();
    expect(sql).toBe(
      "UPDATE users SET name = 'John Doe', age = '30' WHERE id = 1"
    );
  });

  it("should handle special characters in field values", () => {
    const command = new UpdateCommand("users", { name: "O'Reilly" }, 1);
    const sql = command.generate();
    expect(sql).toBe("UPDATE users SET name = 'O''Reilly' WHERE id = 1");
  });
});
