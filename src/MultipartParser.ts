import parseHeader from './lib/parseHeader.ts';
import parseText from './lib/parseText.ts';
import PartParser from './PartParser.ts';

export const ParseStatus = {
  Parts: 1,
} as const;

export interface ParsingState {
  status: (typeof ParseStatus)[keyof typeof ParseStatus];
  boundaryEnd: string | null;
}

export default class MultipartParser {
  type: string;
  headers: Record<string, string> = {};
  parts: PartParser[] = [];

  private _parsingState: ParsingState | null = {
    status: ParseStatus.Parts,
    boundaryEnd: null,
  };
  private boundary: string | null = null;

  constructor(headers: Headers | string | Record<string, string>) {
    if (!headers) throw new Error('Headers missing');

    let contentType: string;
    if (typeof headers === 'string') contentType = headers;
    /* c8 ignore start */ else if (headers.get) contentType = (headers as Headers).get('content-type');
    /* c8 ignore stop */ else contentType = (headers as Record<string, string>)['content-type'];
    if (!contentType) throw Error('content-type header not found');

    const parts = contentType.split(/;/g);
    this.type = parts.shift().trim();
    if (this.type.indexOf('multipart') !== 0) {
      throw new Error(`Expecting a multipart type. Received: ${contentType}`);
    }

    parts.forEach((part) => parseHeader(this.headers, part, '='));

    // boundary
    if (!this.headers.boundary) throw new Error('Invalid Content Type: no boundary');
    this.boundary = `--${this.headers.boundary}`;
    this._parsingState.boundaryEnd = `--${this.headers.boundary}--`;
    this._parsingState.status = ParseStatus.Parts;
  }

  done(): boolean {
    return !this._parsingState;
  }

  parse(text: string): MultipartParser {
    parseText(this, text);
    return this;
  }

  push(line: string): void {
    const part = this.parts.length ? this.parts[this.parts.length - 1] : null;

    if (!this._parsingState) throw new Error('Attempting to parse a completed multipart');
    if (line === null) {
      if (part && !part.done()) part.push(null);
      this._parsingState = null;
      return;
    }

    if (line === this._parsingState.boundaryEnd) this.push(null);
    else if (line === this.boundary) {
      if (part && !part.done()) part.push(null);
      this.parts.push(new PartParser());
    } else if (part) part.push(line);
    else {
      if (line.length) throw new Error(`Unexpected line: ${line}`);
    }
  }

  get responses(): Response[] {
    if (this._parsingState) throw new Error('Attempting to use an incomplete parser');
    return this.parts.map((part) => part.response);
  }
}
