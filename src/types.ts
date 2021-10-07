export interface Version {
  major: number;
  minor: number;
}

export interface HeadersObject {
  [key: string]: string;
}

export interface Parser {
  done: () => boolean;
  push: (line: string | null) => void;
}
