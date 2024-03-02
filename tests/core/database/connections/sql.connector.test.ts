import { ConfigService } from "@core/common/services/config.service";
import { EnvironmentStore } from "@core/common/services/environment-store.service";
import { SqlDatabaseConnection } from "@core/database/connections/sql.connector";
import { createPool } from "mysql2";
import { mock } from "ts-mockito";
import mysql2 from "mysql2";

jest.mock("mysql2", () => ({
  createPool: jest.fn().mockReturnValue({
    end: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe("SqlDatabaseConnection", () => {
  let environmentStore: EnvironmentStore;
  let configService: ConfigService;
  let sqlDatabaseConnection: SqlDatabaseConnection;

  beforeEach(() => {
    environmentStore = mock(EnvironmentStore);
    configService = new ConfigService(environmentStore);
    sqlDatabaseConnection = new SqlDatabaseConnection(configService);
  });

  it("should open connection", async () => {
    const mockPool = {
      end: jest.fn().mockResolvedValue(undefined),
    };
    jest.spyOn(configService, "get").mockReturnValue("test");
    jest.spyOn(mysql2, "createPool").mockReturnValue(mockPool as any);

    await sqlDatabaseConnection.openConnection();

    expect(createPool).toHaveBeenCalledWith({
      host: "test",
      port: parseInt("test"),
      user: "test",
      password: "test",
      database: "test",
    });
  });

  it("should close connection", async () => {
    const mockPool = {
      end: jest.fn().mockResolvedValue(undefined),
    };
    sqlDatabaseConnection["_connection"] = mockPool;

    await sqlDatabaseConnection.closeConnection();

    expect(mockPool.end).toHaveBeenCalled();
  });
});
