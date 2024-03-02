import { Injectable } from "../decorators/injectable.decorator";
import { SecretStore } from "../interfaces/secret-store.interface";

@Injectable
export class EnvironmentStore implements SecretStore {
  getEnvironmentVariables(): any {
    return process.env;
  }

  get(key: string): string | undefined {
    return process.env[key];
  }
}
