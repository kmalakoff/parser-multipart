import type { Version, HeadersObject } from "./types";
export declare enum ParseStatus {
    Headers = 1,
    Body = 2
}
export interface ParsingState {
    status: ParseStatus;
    lines: string[];
}
export default class MultipartResponse {
    version: Version;
    headers: HeadersObject;
    ok: boolean;
    status: number;
    statusText: string;
    body: string;
    private _parsingState;
    done(): boolean;
    parse(text: string): void;
    push(line: string): void;
    text(): string;
    json(): unknown;
}
