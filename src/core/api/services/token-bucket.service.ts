export class TokenBucket {
  private last: number;
  private tokens: number;

  constructor(private rate: number, private size: number) {
    this.tokens = this.size;
    this.last = Date.now();
  }

  private refill() {
    const now = Date.now();
    const delta = (now - this.last) / 1000;
    const refill = delta * this.rate;

    this.tokens = Math.min(this.tokens + refill, this.size);
    this.last = now;
  }

  consume(count: number = 1) {
    this.refill();

    if (this.tokens < count) {
      return false;
    }

    this.tokens -= count;
    return true;
  }

  availableTokens() {
    this.refill();
    return this.tokens;
  }

  limit() {
    return this.size;
  }

  timeToNextRefill() {
    const tokensAfterRefill =
      this.tokens + this.rate * ((Date.now() - this.last) / 1000);
    const deficit = Math.max(0, 1 - tokensAfterRefill);
    return Math.ceil(deficit / this.rate);
  }
}
