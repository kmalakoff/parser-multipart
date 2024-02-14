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
import ResponseParsed from './ResponseParsed.mjs';
// @ts-ignore
import BodyHeaders from './lib/BodyHeaders.mjs';
// @ts-ignore
import parseHeader from './lib/parseHeader.mjs';
// @ts-ignore
import parseStatus from './lib/parseStatus.mjs';
// @ts-ignore
import parseText from './lib/parseText.mjs';
export var ParseStatus;
(function(ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus || (ParseStatus = {}));
let MultipartResponse = class MultipartResponse {
    done() {
        return !this._parsingState;
    }
    parse(text) {
        parseText(this, text);
    }
    push(line) {
        if (!this._parsingState) throw new Error('Attempting to parse a completed response');
        if (line === null) {
            if (this._parsingState.status !== 2) throw new Error('Unexpected parsing state');
            this.body = this._parsingState.lines.join('\r\n');
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === 1) {
            if (!line.length) this._parsingState.status = 2;
            else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ':');
        } else if (this._parsingState.status === 2) {
            if (!line.length) this.push(null);
            else this._parsingState.lines.push(line);
        }
    }
    get response() {
        if (this._parsingState) throw new Error('Attempting to use an incomplete response');
        return new ResponseParsed(this);
    }
    constructor(contentType){
        _define_property(this, "contentType", void 0);
        _define_property(this, "headers", null);
        _define_property(this, "body", null);
        _define_property(this, "_parsingState", {
            status: 2,
            lines: []
        });
        if (contentType === undefined) throw new Error('Response missing a content type');
        this.contentType = contentType;
        if (this.contentType === 'application/http') {
            this.headers = new BodyHeaders();
            this._parsingState.status = 1;
        }
    }
};
export { MultipartResponse as default };
