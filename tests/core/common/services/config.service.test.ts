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

  it("should return a boolean when the value is 'true' or 'false'", () => {
    const key = "testKey";
    when(environmentStore.get(key)).thenReturn("true");

    const result = configService.get<boolean>(key);

    expect(result).toEqual(true);
    verify(environmentStore.get(key)).once();
  });

  it("should return a number when the value is a numeric string", () => {
    const key = "testKey";
    when(environmentStore.get(key)).thenReturn("123");

    const result = configService.get<number>(key);

    expect(result).toEqual(123);
    verify(environmentStore.get(key)).once();
  });

  it("should return an array when the value is a comma-separated string", () => {
    const key = "testKey";
    when(environmentStore.get(key)).thenReturn("[a,b,c]");

    const result = configService.get<string[]>(key);

    expect(result).toEqual(["a", "b", "c"]);
    verify(environmentStore.get(key)).once();
  });

  it("should return a date when the value is a date string", () => {
    const key = "testKey";
    const date = new Date();
    when(environmentStore.get(key)).thenReturn(date.toISOString());

    const result = configService.get<Date>(key);

    expect(result).toEqual(date);
    verify(environmentStore.get(key)).once();
  });

  it("should return the original string when the value cannot be converted to the specified type", () => {
    const key = "testKey";
    when(environmentStore.get(key)).thenReturn("not a number");

    const result = configService.get<number>(key);

    expect(typeof result).toEqual("string");
    verify(environmentStore.get(key)).once();
  });
});
