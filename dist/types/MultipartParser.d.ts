import Part from './PartParser.ts';
export declare enum ParseStatus {
    Parts = 1
}
export interface ParsingState {
    status: ParseStatus;
    boundaryEnd: string | null;
}
export default class MultipartParser {
    type: string;
    headers: Record<string, string>;
    parts: Part[];
    private _parsingState;
    private boundary;
    constructor(headers: Headers | string | Record<string, string>);
    done(): boolean;
    parse(text: string): MultipartParser;
    push(line: string): void;
    get responses(): Response[];
}
