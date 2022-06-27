export { default as Parser } from './Parser.js';
export { default as Part } from './Part.js';
export { default as Response } from './Response.js';
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
