import ResponseParser from './ResponseParser.ts';
export default class ParsedResponse implements Response {
    private _parser;
    private _bodyUsed;
    constructor(parser: ResponseParser);
    get type(): ResponseType;
    get headers(): Headers;
    get body(): ReadableStream<Uint8Array>;
    get ok(): boolean;
    get status(): number;
    get statusText(): string;
    get redirected(): boolean;
    get url(): string;
    clone(): ParsedResponse;
    get bodyUsed(): boolean;
    text(): Promise<string>;
    json(): Promise<unknown>;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
}
