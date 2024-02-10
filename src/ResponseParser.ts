// @ts-ignore
import parseHeader from './lib/parseHeader.ts';
// @ts-ignore
import parseStatus from './lib/parseStatus.ts';
// @ts-ignore
import parseText from './lib/parseText.ts';
// @ts-ignore
import ResponseParsed from './ResponseParsed.ts';
// @ts-ignore
import type { Parser } from './ResponseParsed.ts';
// @ts-ignore
import BodyHeaders from './lib/BodyHeaders.ts';

export enum ParseStatus {
  Headers = 1,
  Body,
}

export interface ParsingState {
  status: ParseStatus;
  lines: string[];
}

export default class MultipartResponse {
  contentType: string;
  headers: BodyHeaders = null;
  body: string = null;

  private _parsingState: ParsingState | null = {
    status: ParseStatus.Body,
    lines: [],
  };

  constructor(contentType: string) {
    if (contentType === undefined) throw new Error('Response missing a content type');
    this.contentType = contentType;
    if (this.contentType === 'application/http') {
      this.headers = new BodyHeaders();
      this._parsingState.status = ParseStatus.Headers;
    }
  }

  done(): boolean {
    return !this._parsingState;
  }

  parse(text: string): void {
    parseText(this, text);
  }

  push(line: string): void {
    if (!this._parsingState) throw new Error('Attempting to parse a completed response');
    if (line === null) {
      if (this._parsingState.status !== ParseStatus.Body) throw new Error('Unexpected parsing state');
      this.body = this._parsingState.lines.join('\r\n');
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus.Headers) {
      if (!line.length) this._parsingState.status = ParseStatus.Body;
      else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ':');
    } else if (this._parsingState.status === ParseStatus.Body) {
      if (!line.length) this.push(null);
      else this._parsingState.lines.push(line);
    }
  }

  get response(): Response {
    if (this._parsingState) throw new Error('Attempting to use an incomplete response');
    return new ResponseParsed(this as Parser);
  }
}
