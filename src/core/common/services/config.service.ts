import { Injectable } from "../decorators/injectable.decorator";
import { EnvironmentVariableException } from "../exceptions/invalid-environment-variable.exception";
import { EnvironmentStore } from "./environment-store.service";

@Injectable
export class ConfigService {
  constructor(private readonly environmentStore: EnvironmentStore) {}

  get(key: string): string {
    const value = this.environmentStore.get(key);
    if (value === undefined) {
      throw new EnvironmentVariableException(key);
    }
    return value;
  }

  getString(key: string, defaultValue?: string): string {
    const value = this.get(key);
    if (!value && defaultValue) {
      return defaultValue;
    }

    if (!value && !defaultValue) {
      throw new EnvironmentVariableException(key);
    }

    return value;
  }

  getInteger(key: string, defaultValue?: number): number {
    const value = this.get(key);
    if (!value && defaultValue) {
      return defaultValue;
    }

    if (!value && !defaultValue) {
      throw new EnvironmentVariableException(key);
    }

    try {
      return parseInt(value);
    } catch (error: any) {
      throw new EnvironmentVariableException(error.message);
    }
  }

  getFloat(key: string, defaultValue?: number): number {
    const value = this.get(key);
    if (!value && defaultValue) {
      return defaultValue;
    }

    if (!value && !defaultValue) {
      throw new EnvironmentVariableException(key);
    }

    try {
      return parseFloat(value);
    } catch (error: any) {
      throw new EnvironmentVariableException(error.message);
    }
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key);
    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }

    if (
      value !== "true" &&
      value !== "false" &&
      value !== "1" &&
      value !== "0"
    ) {
      throw new EnvironmentVariableException(
        `Invalid boolean value for key: ${key}`
      );
    }

    return value === "true" || value === "1";
  }

  getArray(key: string, defaultValue?: string[]): string[] {
    const value = this.get(key);
    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }

    try {
      const parsedValue = JSON.parse(value);
      if (!Array.isArray(parsedValue)) {
        throw new EnvironmentVariableException(`
          Invalid array value for key: ${key}
          `);
      }
      return parsedValue;
    } catch {
      throw new EnvironmentVariableException(
        `Invalid array value for key: ${key}`
      );
    }
  }

  getObject(
    key: string,
    defaultValue?: Record<string, unknown>
  ): Record<string, unknown> {
    const value = this.get(key);
    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch {
      throw new EnvironmentVariableException(
        `Invalid object value for key: ${key}`
      );
    }
  }

  getEnvironment(): string {
    return this.environmentStore.get("NODE_ENV") || "development";
  }
}
