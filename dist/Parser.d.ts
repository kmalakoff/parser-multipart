import Part from "./Part";
import type { HeadersObject } from "./types";
export declare enum ParseStatus {
    Parts = 1
}
export interface ParsingState {
    status: ParseStatus;
    boundaryEnd: string | null;
}
export default class MultipartParser {
    type: string;
    headers: HeadersObject;
    parts: Part[];
    private _parsingState;
    private boundary;
    constructor(headers: Headers | string | HeadersObject);
    done(): boolean;
    parse(text: string): void;
    push(line: string): void;
}
