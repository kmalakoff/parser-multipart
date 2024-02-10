import MultipartResponse from "./ResponseParser.ts";
export declare enum ParseStatus {
  Headers = 1,
  Response = 2,
}
export interface ParsingState {
  status: ParseStatus;
}
export default class MultipartPart {
  headers: Record<string, string>;
  _response: MultipartResponse | null;
  private _parsingState;
  done(): boolean;
  parse(text: string): void;
  push(line: string): void;
  get response(): Response;
}
