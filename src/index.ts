export { default as Parser } from "./Parser";
export { default as Part } from "./Part";
export { default as Response } from "./Response";

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
