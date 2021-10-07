import { Version } from "../types";
export interface StatusResult {
    version: Version;
    ok: boolean;
    status: number;
    statusText: string;
}
export default function parseStatus(result: StatusResult, line: string): boolean;
