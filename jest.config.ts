import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testRegex: ".*\\.test\\.ts$",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  setupFiles: ["<rootDir>/jest.setup.ts"],
  collectCoverage: true,
  coverageReporters: ["lcov"],
};

export default config;
