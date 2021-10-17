function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import parseHeader from "./lib/parseHeader.js";
import parseStatus from "./lib/parseStatus.js";
import parseText from "./lib/parseText.js";
export let ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
  ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus || (ParseStatus = {}));

export default class MultipartResponse {
  constructor() {
    _defineProperty(this, "version", void 0);

    _defineProperty(this, "headers", {});

    _defineProperty(this, "ok", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "statusText", void 0);

    _defineProperty(this, "body", null);

    _defineProperty(this, "_parsingState", {
      status: ParseStatus.Headers,
      lines: []
    });
  }

  done() {
    return !this._parsingState;
  }

  parse(text) {
    parseText(this, text);
  }

  push(line) {
    if (!this._parsingState) throw new Error("Attempting to parse a completed response");

    if (line === null) {
      if (this._parsingState.status !== ParseStatus.Body) throw new Error("Unexpected parsing state");
      this.body = this._parsingState.lines.join("\r\n");
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus.Headers) {
      if (!line.length) this._parsingState.status = ParseStatus.Body;else if (!parseStatus(this, line)) parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus.Body) {
      if (!line.length) this.push(null);else this._parsingState.lines.push(line);
    }
  }

  text() {
    if (this._parsingState) throw new Error("Attempting to use an incomplete response");
    return this.body;
  }

  json() {
    if (this._parsingState) throw new Error("Attempting to use an incomplete response");

    if (this.headers["content-type"].indexOf("application/json") === -1) {
      throw new Error(`Not json response. Content type: ${this.headers["content-type"]}`);
    }

    return JSON.parse(this.body);
  }

}
//# sourceMappingURL=Response.js.map