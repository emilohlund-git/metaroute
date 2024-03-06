import "reflect-metadata";

import path from "path";
import { readFileSync } from "fs";
import { FileParseException } from "./exceptions/file-parse.exception";
import { ConsoleLogger } from "./services/console-logger.service";
import { Initializable } from "./interfaces/initializable.interface";
import { Injectable } from "./decorators/injectable.decorator";
import { Scope } from "./enums/scope.enum";

@Injectable({ scope: Scope.CONFIGURATOR })
export class EnvironmentConfigurator implements Initializable {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(EnvironmentConfigurator.name);
  }

  async setup() {
    try {
      await this.configureEnvironment();
    } catch (error: any) {
      this.logger.warn("Error configuring environment: " + error.message);
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
        throw new FileParseException("Could not find environment file");
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
