import MultipartResponse from './ResponseParser.mjs';
import parseHeader from './lib/parseHeader.mjs';
import parseText from './lib/parseText.mjs';
export var ParseStatus = /*#__PURE__*/ function(ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Response"] = 2] = "Response";
    return ParseStatus;
}({});
let MultipartPart = class MultipartPart {
    done() {
        return !this._parsingState;
    }
    parse(text) {
        parseText(this, text);
    }
    push(line) {
        if (!this._parsingState) throw new Error('Attempting to parse a completed part');
        if (line === null) {
            if (this._parsingState.status !== 2) throw new Error('Unexpected parsing state');
            if (!this._response.done()) this._response.push(null);
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === 1) {
            if (!line.length) {
                if (this.headers['content-type'] === undefined) throw new Error('Missing content type');
                this._parsingState.status = 2;
                this._response = new MultipartResponse(this.headers['content-type']);
            } else parseHeader(this.headers, line, ':');
        } else if (this._parsingState.status === 2) {
            this._response.push(line);
        }
    }
    get response() {
        if (this._parsingState) throw new Error('Attempting to use an incomplete part');
        return this._response.response;
    }
    constructor(){
        this.headers = {};
        this._parsingState = {
            status: 1
        };
    }
};
export { MultipartPart as default };
