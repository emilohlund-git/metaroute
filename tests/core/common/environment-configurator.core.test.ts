import { EnvironmentConfigurator } from "@core/common/environment-configurator.core";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import * as fs from "fs";
import path from "path";

jest.mock("@core/common/services/console-logger.service");
jest.mock("fs");

describe("EnvironmentConfigurator", () => {
  let environmentConfigurator: EnvironmentConfigurator;
  let mockLogger: jest.Mocked<ConsoleLogger>;
  let mockReadFileSync: jest.Mock;

  beforeEach(() => {
    mockLogger = new ConsoleLogger("TEST") as jest.Mocked<ConsoleLogger>;
    mockReadFileSync = fs.readFileSync as jest.Mock;
    environmentConfigurator = new EnvironmentConfigurator();
    (environmentConfigurator as any).logger = mockLogger;
  });

  it("should configure environment with .env file if NODE_ENV is undefined", async () => {
    process.env.NODE_ENV = undefined;
    const envFilePath = path.join(process.cwd(), ".env");
    mockReadFileSync.mockReturnValue("KEY=VALUE\n");

    await environmentConfigurator.setup();

    expect(mockLogger.debug).toHaveBeenCalledWith(
      `Environment file: ${envFilePath}`
    );
    expect(process.env.KEY).toBe("VALUE");
  });

  it("should configure environment with .env.[NODE_ENV] file if NODE_ENV is defined", async () => {
    process.env.NODE_ENV = "test";
    const envFilePath = path.join(process.cwd(), ".env.test");
    mockReadFileSync.mockReturnValue("KEY=VALUE\n");

    await environmentConfigurator.setup();

    expect(mockLogger.debug).toHaveBeenCalledWith(
      `Environment file: ${envFilePath}`
    );
    expect(process.env.KEY).toBe("VALUE");
  });

  it("should log error and throw exception if error occurs while reading environment file", async () => {
    process.env.NODE_ENV = "ostrup";
    const envFilePath = path.join(process.cwd(), ".env");
    mockReadFileSync.mockImplementation(() => {
      throw new Error("Error reading file");
    });

    await expect(environmentConfigurator.setup()).rejects.toThrow(
      "Error reading environment file"
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      "Error reading environment file:"
    );
  });
});
