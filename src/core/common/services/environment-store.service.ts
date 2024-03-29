import { Injectable } from "../decorators/injectable.decorator";
import { Scope } from "../enums/scope.enum";
import { SecretStore } from "../interfaces/secret-store.interface";

@Injectable({ scope: Scope.SINGLETON })
export class EnvironmentStore implements SecretStore {
  getEnvironmentVariables(): any {
    return process.env;
  }

  get(key: string): string | undefined {
    return process.env[key];
  }

  set(key: string, value: string): void {
    process.env[key] = value;
  }
}
