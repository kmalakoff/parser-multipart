import parseHeader from './lib/parseHeader.ts';
import parseText from './lib/parseText.ts';
import MultipartResponse from './ResponseParser.ts';

export const ParseStatus = {
  Headers: 1,
  Response: 2,
} as const;

export interface ParsingState {
  status: (typeof ParseStatus)[keyof typeof ParseStatus];
}

export default class MultipartPart {
  headers: Record<string, string> = {};
  _response: MultipartResponse | null = null;

  private _parsingState: ParsingState | null = {
    status: ParseStatus.Headers,
  };

  done(): boolean {
    return !this._parsingState;
  }

  parse(text: string): void {
    parseText(this, text);
  }

  push(line: string | null): void {
    if (!this._parsingState) throw new Error('Attempting to parse a completed part');
    if (line === null) {
      if (this._parsingState.status !== ParseStatus.Response) throw new Error('Unexpected parsing state');
      if (!(this._response as MultipartResponse).done()) (this._response as MultipartResponse).push(null);
      this._parsingState = null;
      return;
    }

    if (this._parsingState.status === ParseStatus.Headers) {
      if (!line.length) {
        if (this.headers['content-type'] === undefined) throw new Error('Missing content type');
        this._parsingState.status = ParseStatus.Response;
        this._response = new MultipartResponse(this.headers['content-type']);
      } else parseHeader(this.headers, line, ':');
    } else if (this._parsingState.status === ParseStatus.Response) {
      (this._response as MultipartResponse).push(line);
    }
  }

  get response(): Response {
    if (this._parsingState) throw new Error('Attempting to use an incomplete part');
    return (this._response as MultipartResponse).response;
  }
}
