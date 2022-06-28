import Part from './Part.ts';
import type { HeadersObject } from './index.ts';
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
