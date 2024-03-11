import path from "path";
import { Initializable } from "./interfaces/initializable.interface";
import fs from "fs";
import { ConsoleLogger } from "../common/services/console-logger.service";
import { ConfigService } from "../common/services/config.service";
import { Injectable } from "../common/decorators/injectable.decorator";
import { Scope } from "../common/enums/scope.enum";

/**
 * @class ImportHandler
 * @implements Initializable
 *
 * @description This class is responsible for handling imports of files in the project.
 * Include it in the configurators array of the App decorator to use it, and it will
 * automatically import all files in the project. This is useful for ensuring that all
 * files are imported and available for use in the application.
 *
 * @example
 * ```ts
 * import { App, Application, ImportHandler } from "metaroute-ts";
 *
 * @App({
 *  configurators: [ImportHandler],
 * })
 * class TestApp extends Application {}
 * ```
 *
 * @remarks This class is a singleton and should be included in the configurators array of the App decorator.
 * It is also a Configurator, so it will be automatically set up by the MetaRouteCore.
 *
 * @see {@link MetaRouteCore}
 */
@Injectable({ scope: Scope.SINGLETON })
export class ImportHandler implements Initializable {
  private readonly modules = new Map<string, any>();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: ConsoleLogger
  ) {
    this.logger.setContext(ImportHandler.name);
  }

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
    const env = this.configService.getEnvironment();
    this.logger.debug(`Environment: ${env}`);
    const srcDirectory = path.join(
      process.cwd(),
      env === "development" ? "src" : "dist"
    );

    let fileType: string = env === "development" ? ".ts" : ".js";

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
        console.log("Importing directory:", fullPath);
        try {
          await this.importFiles(fullPath, fileType);
        } catch (error: any) {
          this.logger.error(`Failed to import ${fullPath}: ${error.message}`);
          throw new Error(`Failed to import ${fullPath}: ${error.message}`);
        }
      } else if (entry.isFile() && entry.name.endsWith(`${fileType}`)) {
        const module = await import(fullPath);
        this.modules.set(fullPath, module);
      }
    }
  };
}
