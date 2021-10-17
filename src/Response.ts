import parseHeader from "./lib/parseHeader.js";
import parseStatus from "./lib/parseStatus.js";
import parseText from "./lib/parseText.js";
import type { Version, HeadersObject } from "./index.js";

export enum ParseStatus {
  Headers = 1,
  Body,
}

export interface ParsingState {
  status: ParseStatus;
  lines: string[];
}

export default class MultipartResponse {
  version: Version;
  headers: HeadersObject = {};
  ok: boolean;
  status: number;
  statusText: string;
  body: string = null;

  // bodyUsed: boolean;
  // redirected: boolean;
  // trailer: Promise<Headers>;
  // type: ResponseType;
  // url: string;

  private _parsingState: ParsingState | null = {
    status: ParseStatus.Headers,
    lines: [],
  };

  done(): boolean {
    return !this._parsingState;
  }

  parse(text: string): void {
    parseText(this, text);
  }

  push(line: string): void {
    if (!this._parsingState) throw new Error("Attempting to parse a completed response");
    if (line === null) {
      if (this._parsingState.status !== ParseStatus.Body) throw new Error("Unexpected parsing state");
      this.body = this._parsingState.lines.join("\r\n");
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus.Headers) {
      if (!line.length) this._parsingState.status = ParseStatus.Body;
      else if (!parseStatus(this, line)) parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus.Body) {
      if (!line.length) this.push(null);
      else this._parsingState.lines.push(line);
    }
  }

  text(): string {
    if (this._parsingState) throw new Error("Attempting to use an incomplete response");
    return this.body;
  }

  json(): unknown {
    if (this._parsingState) throw new Error("Attempting to use an incomplete response");
    if (this.headers["content-type"].indexOf("application/json") === -1) {
      throw new Error(`Not json response. Content type: ${this.headers["content-type"]}`);
    }
    return JSON.parse(this.body);
  }
}
