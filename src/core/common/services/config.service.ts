import { Injectable } from "../decorators/injectable.decorator";
import { EnvironmentVariableException } from "../exceptions/invalid-environment-variable.exception";
import { EnvironmentStore } from "./environment-store.service";

@Injectable
export class ConfigService {
  constructor(private readonly environmentStore: EnvironmentStore) {}

  get<T = string>(key: string): T {
    const value = this.environmentStore.get(key);
    if (!value) {
      throw new EnvironmentVariableException(
        `Config error: ${key} is not defined`
      );
    }
    try {
      return this.convertToType<T>(value);
    } catch (error) {
      throw new EnvironmentVariableException(
        `Config error: ${key} could not be converted to the specified type`
      );
    }
  }

  private convertToType<T>(value: string): T {
    if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
      return (value.toLowerCase() === "true") as unknown as T;
    }

    if (!isNaN(+value)) {
      return +value as unknown as T;
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      console.log(value);
      return value.slice(1, -1).split(",") as unknown as T;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date as unknown as T;
    }

    return value as unknown as T;
  }
}
