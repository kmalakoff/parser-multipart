export interface Version {
  major: number;
  minor: number;
}
export interface IParser {
  done: () => boolean;
  push: (line: string | null) => void;
}
