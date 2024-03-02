import { FindCommand } from "@core/database/commands/sql/find.command";

describe("FindCommand", () => {
  it("should generate correct SQL when entity has one property", () => {
    const command = new FindCommand("users", { id: 1 });
    expect(command.generate()).toBe("SELECT * FROM users WHERE id = '1';");
  });

  it("should generate correct SQL when entity has multiple properties", () => {
    const command = new FindCommand("users", { id: 1, name: "John" });
    expect(command.generate()).toBe(
      "SELECT * FROM users WHERE id = '1';name = 'John';"
    );
  });

  it("should generate correct SQL when entity is empty", () => {
    const command = new FindCommand("users", {});
    expect(command.generate()).toBe("SELECT * FROM users WHERE ");
  });
});
