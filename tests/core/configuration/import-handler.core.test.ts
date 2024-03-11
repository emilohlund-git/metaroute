import { ConfigService, ConsoleLogger, EnvironmentStore } from "@core/common";
import { ImportHandler } from "../../../src/core/configuration/import-handler.core";
import fs, { Dirent } from "fs";
import * as path from "path";

jest.mock("process", () => ({
  cwd: () => "/mock/path",
}));

jest.mock("fs", () => ({
  readdirSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: (...args: string[]) => args.join("\\"),
}));

jest.mock("module", () => ({
  createRequire: () => () => ({}),
}));

describe("ImportHandler", () => {
  let importHandler: ImportHandler;
  let configService: ConfigService;
  let logger: ConsoleLogger;
  let environmentStore: EnvironmentStore;

  beforeEach(() => {
    environmentStore = new EnvironmentStore();
    configService = new ConfigService(environmentStore);
    logger = new ConsoleLogger("ImportHandler");
    importHandler = new ImportHandler(configService, logger);
    process.env.NODE_ENV = "development";
  });

  describe("setup", () => {
    it("should throw an error if an import fails", async () => {
      jest.spyOn(fs, "readdirSync").mockImplementation(() => {
        throw new Error("Error handling imports");
      });
      await expect(importHandler.setup()).rejects.toThrow(
        "Error handling imports"
      );
    });

    it("should skip if directory includes 'node_modules' or '.git'", async () => {
      const mockDirent: Dirent = {
        name: "node_modules",
        isFile: () => false,
        isDirectory: () => true,
      } as any as Dirent;

      (fs.readdirSync as jest.Mock).mockReturnValue([mockDirent]);
      await expect(importHandler.setup()).resolves.not.toThrow();
      expect(fs.readdirSync).not.toHaveBeenCalledWith(
        "/mock/path/node_modules"
      );
    });

    it("should call importFiles recursively if entry is a directory", async () => {
      const mockDirent: Dirent = {
        name: "mockDirectory",
        isFile: () => false,
        isDirectory: () => true,
      } as any as Dirent;

      (fs.readdirSync as jest.Mock)
        .mockReturnValueOnce([mockDirent])
        .mockReturnValueOnce([]);
      await expect(importHandler.setup()).resolves.not.toThrow();
      expect(fs.readdirSync).toHaveBeenCalledWith(
        expect.stringMatching(/\\mockDirectory$/),
        expect.anything()
      );
    });

    it("should throw an error if the module cannot be imported", async () => {
      const mockDirent: Dirent = {
        name: "mockFile.ts",
        isFile: () => true,
        isDirectory: () => false,
        path: "/mock/path/mockFile.ts",
      } as any as Dirent;

      (fs.readdirSync as jest.Mock).mockReturnValue([mockDirent]);

      await expect(importHandler.setup()).rejects.toThrow();
    });
  });
});
