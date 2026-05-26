import { entries as _entries, keys as _keys, values as _values } from './compat.ts';

const SymbolIterator = typeof Symbol !== 'undefined' && Symbol.iterator ? Symbol.iterator : '@@iterator';

class HeadersPolyfill {
  headers: Record<string, string>;

  constructor(headers: Record<string, string>) {
    this.headers = headers;
  }
  get(key: string): string | null {
    return this.headers[key] || null;
  }
  set(key: string, value: string): void {
    this.headers[key] = value;
  }
  append(key: string, value: string): void {
    this.headers[key] = value;
  }
  delete(key: string): void {
    delete this.headers[key];
  }
  has(key: string): boolean {
    return this.headers[key] !== undefined;
  }
  forEach(fn: (value: string, key: string, parent: Headers) => void): void {
    for (const key in this.headers) fn(this.headers[key], key, this as unknown as Headers);
  }
  getSetCookie(): string[] {
    throw new Error('Unsupported: getSetCookie');
  }
  entries(): IterableIterator<[string, string]> {
    return _entries(this.headers) as unknown as IterableIterator<[string, string]>;
  }
  keys(): IterableIterator<string> {
    return _keys(this.headers) as unknown as IterableIterator<string>;
  }
  values(): IterableIterator<string> {
    return _values(this.headers) as unknown as IterableIterator<string>;
  }
  [SymbolIterator](): IterableIterator<[string, string]> {
    return this.entries();
  }
}

export default (typeof Headers === 'undefined' ? HeadersPolyfill : Headers) as unknown as typeof Headers;
