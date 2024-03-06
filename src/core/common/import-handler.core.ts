import path from "path";
import { Initializable } from "./interfaces/initializable.interface";
import fs from "fs";
import { ConsoleLogger } from "./services/console-logger.service";
import { ConfigService } from "./services/config.service";

export class ImportHandler implements Initializable {
  private readonly logger = new ConsoleLogger(ImportHandler.name);

  constructor(private readonly configService: ConfigService) {}

  async setup(): Promise<void> {
    try {
      await this.handleImports();
    } catch (error) {
      this.logger.error("Error handling imports");
      throw error;
    }
  }

  protected handleImports = async () => {
    this.logger.debug(`Current working directory: ${process.cwd()}`);
    const srcDirectory = path.join(process.cwd(), "src");

    let fileType: string = "";
    if (this.configService.getEnvironment() === "development") {
      fileType = ".ts";
    } else {
      fileType = ".js";
    }

    try {
      this.logger.debug(
        `Importing ${fileType} files. Directory: ${srcDirectory}.`
      );
      await this.importFiles(srcDirectory, fileType);
    } catch (error: any) {
      this.logger.error(`Error importing ${fileType} files`);
      throw new Error(error.message);
    }
  };

  private importFiles = async (directory: string, fileType: string) => {
    // If directory is node_modules or .git, skip
    if (directory.includes("node_modules") || directory.includes(".git")) {
      return;
    }
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        try {
          await this.importFiles(fullPath, fileType);
        } catch (error: any) {
          this.logger.error(`Failed to import ${fullPath}: ${error.message}`);
          throw new Error(`Failed to import ${fullPath}: ${error.message}`);
        }
      } else if (entry.isFile() && entry.name.endsWith(`${fileType}`)) {
        await require(fullPath);
      }
    }
  };
}
