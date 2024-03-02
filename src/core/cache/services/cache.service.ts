export class CacheService {
  private cache: Record<string, any> = {};
  private ttl: number;
  private maxSize: number;
  private _keys: string[] = [];

  constructor(ttl: number, maxSize: number = 100) {
    this.ttl = ttl;
    this.maxSize = maxSize;
  }

  set(key: string, value: any) {
    const expiry = Date.now() + this.ttl * 1000;
    if (Object.keys(this.cache).length >= this.maxSize) {
      const oldestKey = this._keys.shift();
      if (oldestKey) {
        delete this.cache[oldestKey];
      }
    }
    this.cache[key] = { value, expiry };
    this._keys.push(key);
  }

  get(key: string) {
    const data = this.cache[key];

    if (!data) return null;

    if (Date.now() > data.expiry) {
      delete this.cache[key];
      return null;
    }

    return data.value;
  }

  del(key: string) {
    delete this.cache[key];
  }

  clear() {
    this.cache = {};
    this._keys = [];
  }

  count() {
    return Object.keys(this.cache).length;
  }

  update(key: string, value: any) {
    if (this.cache[key]) {
      this.cache[key].value = value;
    }
  }

  get keys() {
    return this._keys;
  }

  has(key: string) {
    return !!this.cache[key];
  }
}
