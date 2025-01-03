import type { Version } from './types';

export default class BodyHeaders {
  version: Version;
  headers: Record<string, string> = {};
  ok: boolean;
  status: number;
  statusText: string;
}
