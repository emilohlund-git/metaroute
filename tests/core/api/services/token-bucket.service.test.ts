import { TokenBucket } from "@core/api/services/token-bucket.service";

describe("TokenBucket", () => {
  let bucket: TokenBucket;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
    bucket = new TokenBucket(1, 10);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize correctly", () => {
    expect(bucket.consume()).toEqual(true);
  });

  it("should refill tokens correctly", () => {
    for (let i = 0; i < 10; i++) {
      bucket.consume();
    }

    expect(bucket.consume()).toEqual(false);

    jest.advanceTimersByTime(1000);

    expect(bucket.consume()).toEqual(true);
  });

  it("should not consume more tokens than available", () => {
    expect(bucket.consume(11)).toEqual(false);
  });

  it("should consume multiple tokens correctly", () => {
    expect(bucket.consume(5)).toEqual(true);
    expect(bucket.consume(6)).toEqual(false);
  });

  it("should return the correct number of available tokens", () => {
    bucket.consume(5);
    expect(bucket.availableTokens()).toEqual(5);
    jest.advanceTimersByTime(5000);
    expect(bucket.availableTokens()).toEqual(10);
  });

  it("should return the correct bucket size", () => {
    expect(bucket.limit()).toEqual(10);
  });

  it("should return the correct time to next refill", () => {
    bucket.consume(10);
    expect(bucket.timeToNextRefill()).toEqual(1);
    jest.advanceTimersByTime(500);
    expect(bucket.timeToNextRefill()).toEqual(1);
    jest.advanceTimersByTime(500);
    expect(bucket.timeToNextRefill()).toEqual(0);
  });

  it("should handle rapid consumption correctly", () => {
    for (let i = 0; i < 10; i++) {
      expect(bucket.consume()).toEqual(true);
    }
    expect(bucket.consume()).toEqual(false);
    jest.advanceTimersByTime(500);
    expect(bucket.consume()).toEqual(false);
    jest.advanceTimersByTime(500);
    expect(bucket.consume()).toEqual(true);
  });

  it("should handle large consumption correctly", () => {
    expect(bucket.consume(10)).toEqual(true);
    expect(bucket.consume(1)).toEqual(false);
    jest.advanceTimersByTime(10000);
    expect(bucket.consume(1)).toEqual(true);
  });

  it("should handle rapid refills correctly", () => {
    bucket.consume(10);
    jest.advanceTimersByTime(500);
    expect(bucket.availableTokens()).toBeCloseTo(0.5, 1);
    jest.advanceTimersByTime(500);
    expect(bucket.availableTokens()).toBeCloseTo(1, 1);
  });

  it("should handle large refills correctly", () => {
    bucket.consume(10);
    jest.advanceTimersByTime(10000);
    expect(bucket.availableTokens()).toEqual(10);
  });

  it("should return the correct time to next refill for 3 seconds", () => {
    bucket = new TokenBucket(1 / 3, 10); // Refill rate is 1 token every 3 seconds
    bucket.consume(10);
    expect(bucket.timeToNextRefill()).toEqual(3);
  });

  it("should return the correct time to next refill for 5 seconds", () => {
    bucket = new TokenBucket(1 / 5, 10); // Refill rate is 1 token every 5 seconds
    bucket.consume(10);
    expect(bucket.timeToNextRefill()).toEqual(5);
  });

  it("should return the correct time to next refill for 8 seconds", () => {
    bucket = new TokenBucket(1 / 8, 10); // Refill rate is 1 token every 8 seconds
    bucket.consume(10);
    expect(bucket.timeToNextRefill()).toEqual(8);
  });
});
