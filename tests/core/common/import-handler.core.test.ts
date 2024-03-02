import { ImportHandler } from "@core/common/import-handler.core";
import { ConfigService } from "@core/common/services/config.service";
import { EnvironmentStore } from "@core/common/services/environment-store.service";
import fs from "fs";
import path from "path";
import { mock } from "ts-mockito";

jest.mock("@core/common/services/config.service");
jest.mock("fs");

describe("ImportHandler", () => {
  let importHandler: ImportHandler;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockFs: jest.Mocked<typeof fs>;
  let environmentStore: EnvironmentStore;

  beforeEach(() => {
    environmentStore = mock(EnvironmentStore);
    mockConfigService = new ConfigService(
      environmentStore
    ) as jest.Mocked<ConfigService>;
    mockFs = fs as jest.Mocked<typeof fs>;
    importHandler = new ImportHandler(mockConfigService);
  });

  it("should handle imports without error", async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case "SRC_DIRECTORY":
          return "src";
        case "IMPORT_TYPES":
          return ".ts,.js";
        default:
          return "";
      }
    });

    mockFs.readdirSync.mockReturnValue([
      {
        name: "tsconfig.json",
        isDirectory: () => false,
        isFile: () => true,
      } as any,
    ]);

    await expect(importHandler.setup()).resolves.not.toThrow();
  });

  it("should throw an error if importing files fails", async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case "SRC_DIRECTORY":
          return "src";
        case "IMPORT_TYPES":
          return ".ts,.js";
        default:
          return "";
      }
    });

    mockFs.readdirSync.mockImplementation(() => {
      throw new Error("Test error");
    });

    await expect(importHandler.setup()).rejects.toThrow("Test error");
  });

  it("should skip node_modules and .git directories", async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case "SRC_DIRECTORY":
          return "src";
        case "IMPORT_TYPES":
          return ".ts,.js";
        default:
          return "";
      }
    });

    mockFs.readdirSync.mockReturnValue([
      {
        name: "node_modules",
        isDirectory: () => true,
        isFile: () => false,
      } as any,
      {
        name: ".git",
        isDirectory: () => true,
        isFile: () => false,
      },
      {
        name: "tsconfig.json",
        isDirectory: () => false,
        isFile: () => true,
      },
    ]);

    const spy = jest.spyOn(importHandler, "importFiles" as any);

    await importHandler.setup();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(path.join(process.cwd(), "src"), ".ts");
  });
});
