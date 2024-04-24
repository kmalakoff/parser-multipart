class HeadersPolyfill implements Headers {
  headers: Record<string, string>;

  constructor(headers) {
    this.headers = headers;
  }
  get(key) {
    return this.headers[key];
  }
  set(key, value) {
    this.headers[key] = value;
  }
  append(key, value) {
    this.headers[key] = value;
  }
  delete(key) {
    delete this.headers[key];
  }
  has(key) {
    return this.headers[key] === undefined;
  }
  forEach(fn) {
    for (const key in this.headers) fn(this.headers[key]);
  }
  getSetCookie(): string[] {
    throw new Error('Unsupported: getSetCookie');
  }
}

export default typeof Headers === 'undefined' ? HeadersPolyfill : Headers;
