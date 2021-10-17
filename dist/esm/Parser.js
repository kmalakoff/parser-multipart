function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Part from "./Part.js";
import parseHeader from "./lib/parseHeader.js";
import parseText from "./lib/parseText.js";
export let ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
})(ParseStatus || (ParseStatus = {}));

export default class MultipartParser {
  constructor(headers) {
    _defineProperty(this, "type", void 0);

    _defineProperty(this, "headers", {});

    _defineProperty(this, "parts", []);

    _defineProperty(this, "_parsingState", {
      status: ParseStatus.Parts,
      boundaryEnd: null
    });

    _defineProperty(this, "boundary", null);

    if (!headers) throw new Error("Headers missing");
    let contentType;
    if (typeof headers === "string") contentType = headers;
    /* c8 ignore start */
    else if (headers.get) contentType = headers.get("content-type");
    /* c8 ignore stop */
    else contentType = headers["content-type"];
    if (!contentType) throw Error("content-type header not found");
    const parts = contentType.split(/;/g);
    this.type = parts.shift().trim();

    if (this.type.indexOf("multipart") !== 0) {
      throw new Error(`Expecting a multipart type. Received: ${contentType}`);
    }

    for (const part of parts) parseHeader(this.headers, part, "="); // boundary


    if (!this.headers.boundary) throw new Error("Invalid Content Type: no boundary");
    this.boundary = `--${this.headers.boundary}`;
    this._parsingState.boundaryEnd = `--${this.headers.boundary}--`;
    this._parsingState.status = ParseStatus.Parts;
  }

  done() {
    return !this._parsingState;
  }

  parse(text) {
    parseText(this, text);
  }

  push(line) {
    const part = this.parts.length ? this.parts[this.parts.length - 1] : null;
    if (!this._parsingState) throw new Error("Attempting to parse a completed multipart");

    if (line === null) {
      if (part && !part.done()) part.push(null);
      this._parsingState = null;
      return;
    }

    if (line === this._parsingState.boundaryEnd) this.push(null);else if (line === this.boundary) {
      if (part && !part.done()) part.push(null);
      this.parts.push(new Part());
    } else if (part) part.push(line);else {
      if (line.length) throw new Error(`Unexpected line: ${line}`);
    }
  }

}
//# sourceMappingURL=Parser.js.map