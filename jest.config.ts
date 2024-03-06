import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tests/tsconfig.json";

const config: Config = {
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(ts|js)$": ["ts-jest", { tsconfig: "./tests/tsconfig.json" }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
};

export default config;
