// @ts-ignore
import parseHeader from './lib/parseHeader.mjs';
// @ts-ignore
import parseStatus from './lib/parseStatus.mjs';
// @ts-ignore
import parseText from './lib/parseText.mjs';
// @ts-ignore
import ResponseParsed from './ResponseParsed.mjs';
// @ts-ignore
import BodyHeaders from './lib/BodyHeaders.mjs';
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
            if (this._parsingState.status !== ParseStatus.Body) throw new Error('Unexpected parsing state');
            this.body = this._parsingState.lines.join('\r\n');
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === ParseStatus.Headers) {
            if (!line.length) this._parsingState.status = ParseStatus.Body;
            else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ':');
        } else if (this._parsingState.status === ParseStatus.Body) {
            if (!line.length) this.push(null);
            else this._parsingState.lines.push(line);
        }
    }
    get response() {
        if (this._parsingState) throw new Error('Attempting to use an incomplete response');
        return new ResponseParsed(this);
    }
    constructor(contentType){
        this.headers = null;
        this.body = null;
        this._parsingState = {
            status: ParseStatus.Body,
            lines: []
        };
        if (contentType === undefined) throw new Error('Response missing a content type');
        this.contentType = contentType;
        if (this.contentType === 'application/http') {
            this.headers = new BodyHeaders();
            this._parsingState.status = ParseStatus.Headers;
        }
    }
};
export { MultipartResponse as default };
