import {
  ConfigService,
  EnvironmentStore,
  EnvironmentVariableException,
} from "@core/common";
import { instance, mock, verify, when } from "ts-mockito";

describe("ConfigService", () => {
  let configService: ConfigService;
  let environmentStore: EnvironmentStore;

  beforeEach(() => {
    environmentStore = mock(EnvironmentStore);
    configService = new ConfigService(instance(environmentStore));
  });

  it("should return the integer value when the key exists", () => {
    const key = "testKey";
    const value = "123";
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getInteger(key);

    expect(result).toEqual(123);
    verify(environmentStore.get(key)).once();
  });

  it("should return the float value when the key exists", () => {
    const key = "testKey";
    const value = "123.45";
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getFloat(key);

    expect(result).toEqual(123.45);
    verify(environmentStore.get(key)).once();
  });

  it("should return the boolean value when the key exists", () => {
    const key = "testKey";
    const value = "true";
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getBoolean(key);

    expect(result).toEqual(true);
    verify(environmentStore.get(key)).once();
  });

  it("should return the array value when the key exists", () => {
    const key = "testKey";
    const value = '["a","b","c"]';
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getArray(key);

    expect(result).toEqual(["a", "b", "c"]);
    verify(environmentStore.get(key)).once();
  });

  it("should return the object value when the key exists", () => {
    const key = "testKey";
    const value = '{"a":1,"b":2,"c":3}';
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getObject(key);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
    verify(environmentStore.get(key)).once();
  });

  it("should return the environment value", () => {
    const key = "NODE_ENV";
    const value = "development";
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getEnvironment();

    expect(result).toEqual(value);
    verify(environmentStore.get(key)).once();
  });

  it("should return the string value when the key exists", () => {
    const key = "testKey";
    const value = "testValue";
    when(environmentStore.get(key)).thenReturn(value);

    const result = configService.getString(key);

    expect(result).toEqual(value);
    verify(environmentStore.get(key)).once();
  });

  it("should return the default value when the key does not exist", () => {
    const key = "testKey";
    const defaultValue = "defaultValue";
    when(environmentStore.get(key)).thenReturn(undefined);

    const result = configService.get(key, defaultValue);

    expect(result).toEqual(defaultValue);
    verify(environmentStore.get(key)).once();
  });

  it("should throw an exception when the key does not exist and no default value is provided", () => {
    const key = "testKey";
    when(environmentStore.get(key)).thenReturn(undefined);

    expect(() => configService.get(key)).toThrow(EnvironmentVariableException);
    verify(environmentStore.get(key)).once();
  });

  it("should set the value of a key", () => {
    const key = "testKey";
    const value = "testValue";

    configService.set(key, value);

    verify(environmentStore.set(key, value)).once();
  });
});
