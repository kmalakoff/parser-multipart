// @ts-ignore
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import PartParser from './PartParser.mjs';
// @ts-ignore
import parseHeader from './lib/parseHeader.mjs';
// @ts-ignore
import parseText from './lib/parseText.mjs';
export var ParseStatus;
(function(ParseStatus) {
    ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
})(ParseStatus || (ParseStatus = {}));
let MultipartParser = class MultipartParser {
    done() {
        return !this._parsingState;
    }
    parse(text) {
        parseText(this, text);
        return this;
    }
    push(line) {
        const part = this.parts.length ? this.parts[this.parts.length - 1] : null;
        if (!this._parsingState) throw new Error('Attempting to parse a completed multipart');
        if (line === null) {
            if (part && !part.done()) part.push(null);
            this._parsingState = null;
            return;
        }
        if (line === this._parsingState.boundaryEnd) this.push(null);
        else if (line === this.boundary) {
            if (part && !part.done()) part.push(null);
            this.parts.push(new PartParser());
        } else if (part) part.push(line);
        else {
            if (line.length) throw new Error(`Unexpected line: ${line}`);
        }
    }
    get responses() {
        if (this._parsingState) throw new Error('Attempting to use an incomplete parser');
        return this.parts.map((part)=>part.response);
    }
    constructor(headers){
        _define_property(this, "type", void 0);
        _define_property(this, "headers", {});
        _define_property(this, "parts", []);
        _define_property(this, "_parsingState", {
            status: 1,
            boundaryEnd: null
        });
        _define_property(this, "boundary", null);
        if (!headers) throw new Error('Headers missing');
        let contentType;
        if (typeof headers === 'string') contentType = headers;
        else if (headers.get) contentType = headers.get('content-type');
        else contentType = headers['content-type'];
        if (!contentType) throw Error('content-type header not found');
        const parts = contentType.split(/;/g);
        this.type = parts.shift().trim();
        if (this.type.indexOf('multipart') !== 0) {
            throw new Error(`Expecting a multipart type. Received: ${contentType}`);
        }
        parts.forEach((part)=>parseHeader(this.headers, part, '='));
        // boundary
        if (!this.headers.boundary) throw new Error('Invalid Content Type: no boundary');
        this.boundary = `--${this.headers.boundary}`;
        this._parsingState.boundaryEnd = `--${this.headers.boundary}--`;
        this._parsingState.status = 1;
    }
};
export { MultipartParser as default };
