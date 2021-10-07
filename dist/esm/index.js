import newlineIterator from 'newline-iterator';

function parseHeader(result, line, delimiter) {
  const index = line.indexOf(delimiter);
  if (index === -1) throw new Error(`Unexpected header format: ${line}`);
  const key = line.slice(0, index);
  const value = line.slice(index + 1);
  result[key.trim().toLowerCase()] = value.trim();
}

function parseText(parser, text) {
  const iterator = newlineIterator(text);

  for (const line of iterator) parser.push(line);

  if (!parser.done()) parser.push(null);
}

// https://github.com/watson/http-headers/blob/master/index.js
const statusLine = /^[A-Z]+\/(\d)\.(\d) (\d{3}) (.*)$/;
function parseStatus(result, line) {
  const match = line.match(statusLine);
  if (!match) return false;
  result.version = {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10)
  };
  result.status = parseInt(match[3], 10);
  result.statusText = match[4];
  result.ok = result.statusText === "OK";
  return true;
}

let ParseStatus$2;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
  ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus$2 || (ParseStatus$2 = {}));

class MultipartResponse {
  headers = {};
  body = null; // bodyUsed: boolean;
  // redirected: boolean;
  // trailer: Promise<Headers>;
  // type: ResponseType;
  // url: string;

  _parsingState = {
    status: ParseStatus$2.Headers,
    lines: []
  };

  done() {
    return !this._parsingState;
  }

  parse(text) {
    parseText(this, text);
  }

  push(line) {
    if (!this._parsingState) throw new Error("Attempting to parse a completed response");

    if (line === null) {
      if (this._parsingState.status !== ParseStatus$2.Body) throw new Error("Unexpected parsing state");
      this.body = this._parsingState.lines.join("\r\n");
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus$2.Headers) {
      if (!line.length) this._parsingState.status = ParseStatus$2.Body;else if (!parseStatus(this, line)) parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus$2.Body) {
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

let ParseStatus$1;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
  ParseStatus[ParseStatus["Response"] = 2] = "Response";
})(ParseStatus$1 || (ParseStatus$1 = {}));

class MultipartPart {
  headers = {};
  response = new MultipartResponse();
  _parsingState = {
    status: ParseStatus$1.Headers
  };

  done() {
    return !this._parsingState;
  }

  parse(text) {
    parseText(this, text);
  }

  push(line) {
    if (!this._parsingState) throw new Error("Attempting to parse a completed part");

    if (line === null) {
      if (this._parsingState.status !== ParseStatus$1.Response) throw new Error("Unexpected parsing state");
      if (!this.response.done()) this.response.push(null);
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus$1.Headers) {
      if (!line.length) {
        if (this.headers["content-type"] !== "application/http") throw new Error(`Unexpected content type: ${this.headers["content-type"]}`);
        this._parsingState.status = ParseStatus$1.Response;
      } else parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus$1.Response) {
      this.response.push(line);
    }
  }

}

let ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
})(ParseStatus || (ParseStatus = {}));

class MultipartParser {
  headers = {};
  parts = [];
  _parsingState = {
    status: ParseStatus.Parts,
    boundaryEnd: null
  };
  boundary = null;

  constructor(headers) {
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
      this.parts.push(new MultipartPart());
    } else if (part) part.push(line);else {
      if (line.length) throw new Error(`Unexpected line: ${line}`);
    }
  }

}

export { MultipartParser as Parser, MultipartPart as Part, MultipartResponse as Response };
//# sourceMappingURL=index.js.map
