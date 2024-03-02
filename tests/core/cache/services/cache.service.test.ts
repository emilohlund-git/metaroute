import { CacheService } from "@core/cache/services/cache.service";

describe("CacheService", () => {
  let cacheService: CacheService;

  beforeEach(() => {
    jest.useFakeTimers();
    cacheService = new CacheService(1); // 1 second TTL
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should set value in cache", () => {
    cacheService.set("key", "value");
    expect(cacheService.get("key")).toBe("value");
  });

  it("should return null if key does not exist", () => {
    expect(cacheService.get("nonexistent")).toBeNull();
  });

  it("should delete key from cache", () => {
    cacheService.set("key", "value");
    cacheService.del("key");
    expect(cacheService.get("key")).toBeNull();
  });

  it("should return null if key has expired", () => {
    cacheService.set("key", "value");
    expect(cacheService.get("key")).toBe("value");
    jest.advanceTimersByTime(2000); // Advance time by 2 seconds
    expect(cacheService.get("key")).toBeNull();
  });

  it("should clear all keys from cache", () => {
    cacheService.set("key1", "value1");
    cacheService.set("key2", "value2");
    cacheService.clear();
    expect(cacheService.get("key1")).toBeNull();
    expect(cacheService.get("key2")).toBeNull();
  });

  it("should return all keys in cache", () => {
    cacheService.set("key1", "value1");
    cacheService.set("key2", "value2");
    expect(cacheService.keys).toEqual(["key1", "key2"]);
  });

  it("should check if a key exists in cache", () => {
    cacheService.set("key", "value");
    expect(cacheService.has("key")).toBe(true);
    expect(cacheService.has("nonexistent")).toBe(false);
  });

  it("should not exceed max size", () => {
    const maxSize = 2;
    cacheService = new CacheService(1, maxSize);
    cacheService.set("key1", "value1");
    cacheService.set("key2", "value2");
    cacheService.set("key3", "value3");
    expect(cacheService.keys.length).toBe(maxSize);
    expect(cacheService.get("key1")).toBeNull(); // "key1" should be evicted as it's the oldest
    expect(cacheService.get("key2")).toBe("value2");
    expect(cacheService.get("key3")).toBe("value3");
  });

  it("should update value in cache", () => {
    cacheService.set("key", "value");
    cacheService.update("key", "new value");
    expect(cacheService.get("key")).toBe("new value");    
  });

  it("should return a count of keys in cache", () => {
    const count = cacheService.count();
    expect(count).toBe(0);
    cacheService.set("key", "value");
    expect(cacheService.count()).toBe(1);
  });
});
