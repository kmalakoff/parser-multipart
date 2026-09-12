# parser-multipart

Parse `multipart/*` bodies into response-like parts in browser or Node.js.

## Install

```sh
npm install parser-multipart
```

## Parse a response body

```typescript
import { Parser } from "parser-multipart";

const headers = { 'content-type': 'multipart/mixed; boundary=batch' };
const body = [
  '--batch',
  'Content-Type: application/http',
  'Content-ID: response-1',
  '',
  'HTTP/1.1 200 OK',
  'Content-Type: application/json',
  '',
  '{"ok":true}',
  '--batch--',
].join('\n');
const parser = new Parser(headers);
const responses = parser.parse(body).responses;
console.log(await responses[0].json());
```

This prints `{ ok: true }`. The response must have a `multipart/*` content type with a boundary. For a network response, pass its headers and text to the same parser. In Node.js versions without a global `fetch`, provide a fetch implementation such as `cross-fetch`.

For incremental input, call `parser.push(line)` for each line and `parser.push(null)` at end, then read `parser.responses`.

## Documentation

[API Docs](https://kmalakoff.github.io/parser-multipart/)
