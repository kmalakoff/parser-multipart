import type { Version, HeadersObject } from './index.ts';
export declare enum ParseStatus {
    Headers = 1,
    Body = 2
}
export interface ParsingState {
    status: ParseStatus;
    lines: string[];
}
export declare class BodyHeaders {
    version: Version;
    headers: HeadersObject;
    ok: boolean;
    status: number;
    statusText: string;
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
    text(): string;
    json(): unknown;
}
