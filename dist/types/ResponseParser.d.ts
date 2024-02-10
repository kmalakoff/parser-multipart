import BodyHeaders from "./lib/BodyHeaders.ts";
export declare enum ParseStatus {
  Headers = 1,
  Body = 2,
}
export interface ParsingState {
  status: ParseStatus;
  lines: string[];
}
export default class MultipartResponse {
  contentType: string;
  headers: BodyHeaders;
  body: string;
  private _parsingState;
  constructor(contentType: string);
  done(): boolean;
  parse(text: string): void;
  push(line: string): void;
  get response(): Response;
}
