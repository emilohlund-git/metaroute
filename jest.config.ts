import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.test.json";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
};

export default config;
