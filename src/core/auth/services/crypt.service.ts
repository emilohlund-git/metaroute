import { Injectable } from "../../common/decorators/injectable.decorator";
import { ConsoleLogger } from "../../common/services/console-logger.service";
import crypto from "crypto";

@Injectable
export class CryptService {
  private readonly logger = new ConsoleLogger(CryptService.name);

  async hashPassword(password: string, salt: string): Promise<string> {
    this.logger.debug(`[🔒]: Hashing password`);
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return [salt, hash].join("$");
  }

  async generateSalt(): Promise<string> {
    this.logger.debug(`[🔒]: Generating salt`);
    const salt = crypto.randomBytes(16).toString("hex");
    return salt;
  }

  async comparePasswords(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    this.logger.debug(`[🔒]: Comparing passwords`);
    const [salt, storedHash] = storedPassword.split("$");
    const hashedPassword = crypto
      .pbkdf2Sync(enteredPassword, salt, 1000, 64, "sha512")
      .toString("hex");
    return storedHash === hashedPassword;
  }
}
