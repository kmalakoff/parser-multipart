## parser-multipart

Multipart form data parser for browser and node

### Example 1: Text parse

```typescript
import { Parser } from "parser-multipart";

const res = await fetch(/* your url */);
const response = new Multipart(res.headers);
response.parse(await res.text());
return response.parts.map((part) => part.response.json());
```

### Example 2: Line-by-line

```typescript
import { Parser } from "parser-multipart";
import newlineIterator from "newline-iterator";

const res = await fetch(/* your url */);
const response = new Multipart(res.headers);
for (const line of newlineIterator(await res.text())) response.push(line);
return response.parts.map((part) => part.response.json());
```

### Documentation

[API Docs](https://kmalakoff.github.io/parser-multipart/)
