import { ConfigService, EnvironmentStore } from "src";
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
});
