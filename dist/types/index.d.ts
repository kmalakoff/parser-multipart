export { default as Parser } from './Parser.ts';
export { default as Part } from './Part.ts';
export { default as Response } from './Response.ts';
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
