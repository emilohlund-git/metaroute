import { SqlDatabaseCommandExecutor } from "@core/database/executors/sql.executor";
import { SqlDatabaseConnection } from "@core/database/connections/sql.connector";
import { DatabaseCommand } from "@core/database/commands/database-command.abstract";
import { InsertCommand } from "@core/database/commands/sql/insert.command";
import { mock, instance, when } from "ts-mockito";

describe("SqlDatabaseCommandExecutor", () => {
  let sqlDatabaseConnectionMock: SqlDatabaseConnection;
  let sqlDatabaseCommandExecutor: SqlDatabaseCommandExecutor;
  let databaseCommandMock: DatabaseCommand;
  let connectionMock: any;

  beforeEach(() => {
    sqlDatabaseConnectionMock = mock(SqlDatabaseConnection);
    databaseCommandMock = mock(InsertCommand);
    connectionMock = {
      query: jest.fn(),
      promise: jest.fn().mockReturnValue({ query: jest.fn() }), // Mock the promise method
    };
    when(sqlDatabaseConnectionMock.connection).thenReturn(connectionMock);
    sqlDatabaseCommandExecutor = new SqlDatabaseCommandExecutor(
      instance(sqlDatabaseConnectionMock)
    );
  });

  it("should return no results found", async () => {
    when(databaseCommandMock.generate()).thenReturn("SELECT * FROM table");
    connectionMock.promise().query.mockResolvedValue([[]]); // Mock the query method of the promise object

    const result = await sqlDatabaseCommandExecutor.executeCommand(
      instance(databaseCommandMock)
    );

    expect(result).toEqual({ success: false, error: "No results found" });
  });

  it("should return a single result", async () => {
    when(databaseCommandMock.generate()).thenReturn("SELECT * FROM table");
    const mockData = [{ id: 1, name: "Test" }];
    connectionMock.promise().query.mockResolvedValue([mockData]);

    const result = await sqlDatabaseCommandExecutor.executeCommand(
      instance(databaseCommandMock)
    );

    expect(result).toEqual({ success: true, data: mockData[0] });
  });

  it("should return multiple results", async () => {
    when(databaseCommandMock.generate()).thenReturn("SELECT * FROM table");
    const mockData = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];
    connectionMock.promise().query.mockResolvedValue([mockData]);

    const result = await sqlDatabaseCommandExecutor.executeCommand(
      instance(databaseCommandMock)
    );

    expect(result).toEqual({ success: true, data: mockData });
  });

  it("should return duplicate entry error", async () => {
    when(databaseCommandMock.generate()).thenReturn(
      "INSERT INTO table VALUES (1, 'Test')"
    );
    const mockError = {
      errno: 1062,
      message: "Duplicate entry found in database",
    };
    connectionMock.promise().query.mockRejectedValue(mockError);

    const result = await sqlDatabaseCommandExecutor.executeCommand(
      instance(databaseCommandMock)
    );

    expect(result).toEqual({
      success: false,
      error: "Duplicate entry found in database",
    });
  });

  it("should throw an error", async () => {
    when(databaseCommandMock.generate()).thenReturn("SELECT * FROM table");
    const mockError = { errno: 1234, message: "Some error" };
    connectionMock.promise().query.mockRejectedValue(mockError);

    await expect(
      sqlDatabaseCommandExecutor.executeCommand(instance(databaseCommandMock))
    ).rejects.toThrow("Some error");
  });
});
