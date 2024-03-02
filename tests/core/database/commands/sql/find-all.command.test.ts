import { FindAllCommand } from "@core/database/commands/sql/find-all.command";

describe("FindAllCommand", () => {
  it("should be defined", () => {
    expect(new FindAllCommand("test")).toBeDefined();
  });

  describe("generate", () => {
    it("should return a SELECT * FROM statement", () => {
      const command = new FindAllCommand("test");
      expect(command.generate()).toBe("SELECT * FROM test");
    });

    it("should return a SELECT * FROM statement with the correct table name", () => {
      const command = new FindAllCommand("users");
      expect(command.generate()).toBe("SELECT * FROM users");
    });
  });
});
