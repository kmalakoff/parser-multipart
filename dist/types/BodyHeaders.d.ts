import type { Version } from "./types.ts";
export default class BodyHeaders {
  version: Version;
  headers: Record<string, string>;
  ok: boolean;
  status: number;
  statusText: string;
}
