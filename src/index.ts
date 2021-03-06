// @ts-ignore
export { default as Parser } from './Parser.ts';
// @ts-ignore
export { default as Part } from './Part.ts';
// @ts-ignore
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
