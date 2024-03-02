import { RemoveCommand } from "@core/database/commands/sql/remove.command";

describe("RemoveCommand", () => {
  it("should generate correct SQL", () => {
    const command = new RemoveCommand("users", 1);
    const sql = command.generate();
    expect(sql).toBe("DELETE FROM users WHERE ID = 1");
  });

  it("should handle different table names", () => {
    const command = new RemoveCommand("products", 1);
    const sql = command.generate();
    expect(sql).toBe("DELETE FROM products WHERE ID = 1");
  });

  it("should handle different IDs", () => {
    const command = new RemoveCommand("users", 123);
    const sql = command.generate();
    expect(sql).toBe("DELETE FROM users WHERE ID = 123");
  });
});
