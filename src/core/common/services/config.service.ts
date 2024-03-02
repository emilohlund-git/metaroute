import { Injectable } from "../decorators/injectable.decorator";
import { EnvironmentVariableException } from "../exceptions/invalid-environment-variable.exception";
import { EnvironmentStore } from "./environment-store.service";

@Injectable
export class ConfigService {
  constructor(private readonly environmentStore: EnvironmentStore) {}

  get(key: string): string {
    const value = this.environmentStore.get(key);
    if (!value) {
      throw new EnvironmentVariableException(
        `Config error: ${key} is not defined`
      );
    }
    return value;
  }
}
