// @ts-ignore
import parseHeader from './lib/parseHeader.mjs';
// @ts-ignore
import parseText from './lib/parseText.mjs';
// @ts-ignore
import MultipartResponse from './Response.mjs';
export var ParseStatus;
(function(ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Response"] = 2] = "Response";
})(ParseStatus || (ParseStatus = {}));
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
            if (this._parsingState.status !== ParseStatus.Response) throw new Error('Unexpected parsing state');
            if (!this.response.done()) this.response.push(null);
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === ParseStatus.Headers) {
            if (!line.length) {
                if (this.headers['content-type'] === undefined) throw new Error('Missing content type');
                this._parsingState.status = ParseStatus.Response;
                this.response = new MultipartResponse(this.headers['content-type']);
            } else parseHeader(this.headers, line, ':');
        } else if (this._parsingState.status === ParseStatus.Response) {
            this.response.push(line);
        }
    }
    constructor(){
        this.headers = {};
        this._parsingState = {
            status: ParseStatus.Headers
        };
    }
};
export { MultipartPart as default };
