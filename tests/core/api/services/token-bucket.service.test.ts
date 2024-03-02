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
});
