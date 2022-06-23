import parseHeader from "./lib/parseHeader";
import parseText from "./lib/parseText";
import MultipartResponse from "./Response";
import type { HeadersObject } from "./index";

export enum ParseStatus {
  Headers = 1,
  Response,
}

export interface ParsingState {
  status: ParseStatus;
}

export default class MultipartPart {
  headers: HeadersObject = {};
  response: MultipartResponse | null;

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
        if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
        this._parsingState.status = ParseStatus.Response;
        this.response = new MultipartResponse(this.headers["content-type"]);
      } else parseHeader(this.headers, line, ":");
    } else if (this._parsingState.status === ParseStatus.Response) {
      this.response.push(line);
    }
  }
}
