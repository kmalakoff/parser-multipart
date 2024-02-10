// @ts-ignore
// https://github.com/watson/http-headers/blob/master/index.ts
const statusLine = /^[A-Z]+\/(\d)\.(\d) (\d{3}) (.*)$/;
export default function parseStatus(result, line) {
  const match = line.match(statusLine);
  if (!match) return false;
  result.version = {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
  };
  result.status = parseInt(match[3], 10);
  result.statusText = match[4];
  result.ok = result.statusText === "OK";
  return true;
}
