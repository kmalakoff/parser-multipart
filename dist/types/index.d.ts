export { default as Parser } from './MultipartParser.ts';
export { default as Part } from './PartParser.ts';
export { default as Response } from './ResponseParser.ts';
export interface Version {
    major: number;
    minor: number;
}
export interface HeadersObject {
    [key: string]: string;
}
export interface IParser {
    done: () => boolean;
    push: (line: string | null) => void;
}
