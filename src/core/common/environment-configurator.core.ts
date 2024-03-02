import path from "path";
import { Configurator } from "./decorators/configurator.decorator";
import { readFileSync } from "fs";
import { FileParseException } from "./exceptions/file-parse.exception";
import { ConsoleLogger } from "./services/console-logger.service";
import { Initializable } from "./interfaces/initializable.interface";

@Configurator
export class EnvironmentConfigurator implements Initializable {
  private readonly logger = new ConsoleLogger(EnvironmentConfigurator.name);

  async setup() {
    try {
      await this.configureEnvironment();
    } catch (error) {
      this.logger.error("Error configuring environment");
      throw error;
    }
  }

  protected configureEnvironment = async (
    env = process.env.NODE_ENV
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      let envFilePath;

      if (
        process.env.NODE_ENV === undefined ||
        process.env.NODE_ENV === "undefined"
      ) {
        envFilePath = path.join(process.cwd(), `.env`).trim();
        this.logger.debug(`Environment file: ${envFilePath}`);
      } else {
        envFilePath = path.join(process.cwd(), `.env.${env}`).trim();
        this.logger.debug(`Environment file: ${envFilePath}`);
      }

      let envFile;
      try {
        envFile = readFileSync(envFilePath, "utf-8");
      } catch (error) {
        this.logger.error(`Error reading environment file:`);
        this.logger.debug(`Environment file: ${envFilePath}`);
        throw new FileParseException("Error reading environment file");
      }

      try {
        const lines = envFile.split("\n");
        for (let i = 0; i < lines.length; i++) {
          // Skip comments
          if (lines[i].startsWith("#")) {
            continue;
          }
          const [key, value] = lines[i]
            .split("=")
            .map((str) => str.trim().replace(/"/g, ""));
          if (key && value) {
            process.env[key] = value;
          }
        }

        resolve();
      } catch (error) {
        this.logger.error(`Error parsing environment file:`);
        reject(new FileParseException("Error parsing environment file"));
      }
    });
  };
}
