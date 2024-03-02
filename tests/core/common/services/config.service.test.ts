import { EnvironmentVariableException } from "@core/common/exceptions/invalid-environment-variable.exception";
import { ConfigService } from "@core/common/services/config.service";
import { EnvironmentStore } from "@core/common/services/environment-store.service";
import { mock, instance, when, verify } from "ts-mockito";

describe("ConfigService", () => {
  let configService: ConfigService;
  let environmentStore: EnvironmentStore;

  beforeEach(() => {
    environmentStore = mock(EnvironmentStore);
    configService = new ConfigService(instance(environmentStore));
  });

  it("should return the value when the key exists", () => {
    const key = "testKey";
    const value = "testValue";
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.get(key);

    expect(result).toEqual(value);
    verify(environmentStore.get(key)).once();
  });

  it("should throw an error when the key does not exist", () => {
    const key = "testKey";
    when(environmentStore.get(key)).thenReturn(undefined);

    expect(() => configService.get(key)).toThrow(EnvironmentVariableException);
    verify(environmentStore.get(key)).once();
  });
});
