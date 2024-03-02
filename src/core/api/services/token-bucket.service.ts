export class TokenBucket {
  private last: number;
  private tokens: number;

  constructor(private rate: number, private size: number) {
    this.tokens = this.size;
    this.last = Date.now();
  }

  consume(count: number = 1) {
    const now = Date.now();
    const delta = (now - this.last) / 1000; 
    const refill = delta * this.rate;

    this.tokens = Math.min(this.tokens + refill, this.size);
    this.last = now;

    if (this.tokens < count) {
      return false;
    }

    this.tokens -= count;
    return true;
  }
}
