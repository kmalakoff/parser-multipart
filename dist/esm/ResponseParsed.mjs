import HeadersPolyfill from './lib/HeadersPolyfill.mjs';
let ParsedResponse = class ParsedResponse {
    get type() {
        return 'default';
    }
    get headers() {
        return new HeadersPolyfill(this._parser.headers.headers);
    }
    get body() {
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
    text() {
        if (this._bodyUsed) return Promise.reject(new Error('Body already consumed'));
        this._bodyUsed = true;
        return Promise.resolve(this._parser.body);
    }
    json() {
        if (this._bodyUsed) return Promise.reject(new Error('Body already consumed'));
        this._bodyUsed = true;
        return Promise.resolve(JSON.parse(this._parser.body));
    }
    arrayBuffer() {
        return Promise.reject(new Error('Unsupported: arrayBuffer'));
    }
    blob() {
        return Promise.reject(new Error('Unsupported: blob'));
    }
    formData() {
        return Promise.reject(new Error('Unsupported: formData'));
    }
    bytes() {
        return Promise.reject(new Error('Unsupported: bytes'));
    }
    constructor(parser){
        this._parser = parser;
        this._bodyUsed = false;
    }
};
export { ParsedResponse as default };
