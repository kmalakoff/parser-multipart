import Part from "./Part";
import parseHeader from "./lib/parseHeader";
import parseText from "./lib/parseText";
import type { HeadersObject } from "./index";

export enum ParseStatus {
  Parts = 1,
}

export interface ParsingState {
  status: ParseStatus;
  boundaryEnd: string | null;
}

export default class MultipartParser {
  type: string;
  headers: HeadersObject = {};
  parts: Part[] = [];

  private _parsingState: ParsingState | null = {
    status: ParseStatus.Parts,
    boundaryEnd: null,
  };
  private boundary: string | null = null;

  constructor(headers: Headers | string | HeadersObject) {
    if (!headers) throw new Error("Headers missing");

    let contentType: string;
    if (typeof headers === "string") contentType = headers;
    /* c8 ignore start */ else if (headers.get) contentType = (headers as Headers).get("content-type");
    /* c8 ignore stop */ else contentType = (headers as HeadersObject)["content-type"];
    if (!contentType) throw Error("content-type header not found");

    const parts = contentType.split(/;/g);
    this.type = parts.shift().trim();
    if (this.type.indexOf("multipart") !== 0) {
      throw new Error(`Expecting a multipart type. Received: ${contentType}`);
    }
    for (const part of parts) parseHeader(this.headers, part, "=");

    // boundary
    if (!this.headers.boundary) throw new Error("Invalid Content Type: no boundary");
    this.boundary = `--${this.headers.boundary}`;
    this._parsingState.boundaryEnd = `--${this.headers.boundary}--`;
    this._parsingState.status = ParseStatus.Parts;
  }

  done(): boolean {
    return !this._parsingState;
  }

  parse(text: string): void {
    parseText(this, text);
  }

  push(line: string): void {
    const part = this.parts.length ? this.parts[this.parts.length - 1] : null;

    if (!this._parsingState) throw new Error("Attempting to parse a completed multipart");
    if (line === null) {
      if (part && !part.done()) part.push(null);
      this._parsingState = null;
      return;
    }

    if (line === this._parsingState.boundaryEnd) this.push(null);
    else if (line === this.boundary) {
      if (part && !part.done()) part.push(null);
      this.parts.push(new Part());
    } else if (part) part.push(line);
    else {
      if (line.length) throw new Error(`Unexpected line: ${line}`);
    }
  }
}
