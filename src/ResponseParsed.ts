import type ResponseParser from './ResponseParser.js';
import HeadersPolyfill from './lib/HeadersPolyfill.js';

export default class ParsedResponse implements Response {
  private _parser: ResponseParser;
  private _bodyUsed: boolean;

  constructor(parser: ResponseParser) {
    this._parser = parser;
    this._bodyUsed = false;
  }

  get type(): ResponseType {
    return 'default';
  }
  get headers() {
    return new HeadersPolyfill(this._parser.headers.headers as unknown as Record<string, string>) as Headers;
  }
  get body(): ReadableStream<Uint8Array> {
    throw new Error('Not supported: body');
  }
  get ok() {
    return this._parser.headers.ok;
  }
  get status() {
    return this._parser.headers.status;
  }
  get statusText() {
    return this._parser.headers.statusText;
  }
  get redirected() {
    return false;
  }
  get url() {
    return '';
  }
  clone() {
    return new ParsedResponse(this._parser);
  }
  get bodyUsed() {
    return this._bodyUsed;
  }

  text(): Promise<string> {
    if (this._bodyUsed) return Promise.reject(new Error('Body already consumed'));
    this._bodyUsed = true;
    return Promise.resolve(this._parser.body);
  }

  json(): Promise<unknown> {
    if (this._bodyUsed) return Promise.reject(new Error('Body already consumed'));
    this._bodyUsed = true;
    return Promise.resolve(JSON.parse(this._parser.body));
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.reject(new Error('Unsupported: arrayBuffer'));
  }

  blob(): Promise<Blob> {
    return Promise.reject(new Error('Unsupported: blob'));
  }

  formData(): Promise<FormData> {
    return Promise.reject(new Error('Unsupported: formData'));
  }
  bytes(): Promise<Uint8Array> {
    return Promise.reject(new Error('Unsupported: bytes'));
  }
}
