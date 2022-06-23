import MultipartResponse from "./Response";
import type { HeadersObject } from "./index";
export declare enum ParseStatus {
    Headers = 1,
    Response = 2
}
export interface ParsingState {
    status: ParseStatus;
}
export default class MultipartPart {
    headers: HeadersObject;
    response: MultipartResponse | null;
    private _parsingState;
    done(): boolean;
    parse(text: string): void;
    push(line: string): void;
}
