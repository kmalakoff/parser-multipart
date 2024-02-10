## parser-multipart

Multipart form data parser for browser and node

### Example 1: Text parse

```typescript
import { Parser } from 'parser-multipart';

const res = await fetch(/* your url */);
const parser = new Parser(res.headers);
return parser.parse(await res.text()).responses.map((res) => res.json());
```

### Example 2: Line-by-line

```typescript
import { Parser } from 'parser-multipart';
import newlineIterator from 'newline-iterator';

const res = await fetch(/* your url */);
const parser = new Parser(res.headers);
for (const line of newlineIterator(await res.text())) parser.push(line);
return parser.responses.map((res) => res.json());
```

### Documentation

[API Docs](https://kmalakoff.github.io/parser-multipart/)
