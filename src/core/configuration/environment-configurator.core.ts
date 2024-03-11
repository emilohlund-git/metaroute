import "reflect-metadata";

import path from "path";
import { readFileSync } from "fs";
import { FileParseException } from "../common/exceptions/file-parse.exception";
import { ConsoleLogger } from "../common/services/console-logger.service";
import { Initializable } from "./interfaces/initializable.interface";
import { Injectable } from "../common/decorators/injectable.decorator";
import { Scope } from "../common/enums/scope.enum";

@Injectable({ scope: Scope.SINGLETON })
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
        for (const element of lines) {
          if (element.startsWith("#")) {
            continue;
          }
          const [key, value] = element
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
