// @ts-ignore
import HeadersPolyfill from './lib/HeadersPolyfill.ts';
// @ts-ignore
import ResponseParser from './ResponseParser.ts';

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
    if (this._bodyUsed) throw new Error('Body already consumed');
    this._bodyUsed = true;
    return Promise.resolve(this._parser.body);
  }

  json(): Promise<unknown> {
    if (this._bodyUsed) throw new Error('Body already consumed');
    this._bodyUsed = true;
    return Promise.resolve(JSON.parse(this._parser.body));
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Unsupported: arrayBuffer');
  }

  blob(): Promise<Blob> {
    throw new Error('Unsupported: blob');
  }

  formData(): Promise<FormData> {
    throw new Error('Unsupported: formData');
  }
}
