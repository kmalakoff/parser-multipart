import parseHeader from "./lib/parseHeader.js";
import parseText from "./lib/parseText.js";
import MultipartResponse from "./Response.js";
import type { HeadersObject } from "./index.js";

export enum ParseStatus {
  Headers = 1,
  Response,
}

export interface ParsingState {
  status: ParseStatus;
}

export default class MultipartPart {
  headers: HeadersObject = {};
  response: MultipartResponse = new MultipartResponse();

  private _parsingState: ParsingState | null = {
    status: ParseStatus.Headers,
  };

  done(): boolean {
    return !this._parsingState;
  }

  parse(text: string): void {
    parseText(this, text);
  }

  push(line: string): void {
    if (!this._parsingState) throw new Error("Attempting to parse a completed part");
    if (line === null) {
      if (this._parsingState.status !== ParseStatus.Response) throw new Error("Unexpected parsing state");
      if (!this.response.done()) this.response.push(null);
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus.Headers) {
      if (!line.length) {
        if (this.headers["content-type"] !== "application/http")
          throw new Error(`Unexpected content type: ${this.headers["content-type"]}`);
        this._parsingState.status = ParseStatus.Response;
      } else parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus.Response) {
      this.response.push(line);
    }
  }
}
