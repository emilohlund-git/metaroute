import { ConsoleLogger } from "@core/common/services/console-logger.service";
import * as fs from "fs";
import path from "path";
import { LogLevel, MetaRoute } from "@core/common";
import { EnvironmentConfigurator } from "@core/configuration";

jest.mock("fs");

describe("EnvironmentConfigurator", () => {
  let environmentConfigurator: EnvironmentConfigurator;
  let mockLogger: ConsoleLogger;
  let mockReadFileSync: jest.Mock;

  beforeEach(() => {
    mockLogger = MetaRoute.resolve(ConsoleLogger);
    mockLogger.setMinLevel(LogLevel.DEBUG);
    mockReadFileSync = fs.readFileSync as jest.Mock;
    environmentConfigurator = new EnvironmentConfigurator(mockLogger);
    (environmentConfigurator as any).logger = mockLogger;
  });

  it("should configure environment with .env file if NODE_ENV is undefined", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    process.env.NODE_ENV = undefined;
    const envFilePath = path.join(process.cwd(), ".env");
    mockReadFileSync.mockReturnValue("KEY=VALUE\n");

    await environmentConfigurator.setup();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Environment file: ${envFilePath}`)
    );
    expect(process.env.KEY).toBe("VALUE");
  });

  it("should configure environment with .env.[NODE_ENV] file if NODE_ENV is defined", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    process.env.NODE_ENV = "test";
    const envFilePath = path.join(process.cwd(), ".env.test");
    mockReadFileSync.mockReturnValue("KEY=VALUE\n");

    await environmentConfigurator.setup();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Environment file: ${envFilePath}`)
    );
    expect(process.env.KEY).toBe("VALUE");
  });

  it("should log warning if error occurs while reading environment file", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    process.env.NODE_ENV = "ostrup";
    mockReadFileSync.mockImplementation(() => {
      throw new Error("Error reading file");
    });

    await environmentConfigurator.setup();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Error configuring environment: Could not find environment file"
      )
    );
  });
});
