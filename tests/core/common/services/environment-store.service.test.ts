import { EnvironmentStore } from "@core/common/services/environment-store.service";

describe("EnvironmentStore", () => {
  let service: EnvironmentStore;

  beforeEach(() => {
    service = new EnvironmentStore();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getEnvironmentVariables", () => {
    it("should return process.env", () => {
      const result = service.getEnvironmentVariables();
      expect(result).toEqual(process.env);
    });
  });

  describe("get", () => {
    it("should return the value of the specified environment variable", () => {
      const key = "TEST_KEY";
      process.env[key] = "TEST_VALUE";
      const result = service.get(key);
      expect(result).toEqual("TEST_VALUE");
    });

    it("should return undefined if the specified environment variable does not exist", () => {
      const result = service.get("NON_EXISTING_KEY");
      expect(result).toBeUndefined();
    });
  });
});
