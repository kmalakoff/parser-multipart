function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import parseHeader from "./lib/parseHeader.mjs";
import parseText from "./lib/parseText.mjs";
import MultipartResponse from "./Response.mjs";
export let ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
  ParseStatus[ParseStatus["Response"] = 2] = "Response";
})(ParseStatus || (ParseStatus = {}));

export default class MultipartPart {
  constructor() {
    _defineProperty(this, "headers", {});

    _defineProperty(this, "response", void 0);

    _defineProperty(this, "_parsingState", {
      status: ParseStatus.Headers
    });
  }

  done() {
    return !this._parsingState;
  }

  parse(text) {
    parseText(this, text);
  }

  push(line) {
    if (!this._parsingState) throw new Error("Attempting to parse a completed part");

    if (line === null) {
      if (this._parsingState.status !== ParseStatus.Response) throw new Error("Unexpected parsing state");
      if (!this.response.done()) this.response.push(null);
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus.Headers) {
      if (!line.length) {
        if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
        this._parsingState.status = ParseStatus.Response;
        this.response = new MultipartResponse(this.headers["content-type"]);
      } else parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus.Response) {
      this.response.push(line);
    }
  }

}
//# sourceMappingURL=Part.mjs.map