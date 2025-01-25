import newlineIterator from 'newline-iterator';

interface Parser {
  done: () => boolean;
  push: (line: string | null) => void;
}

export default function parseText(parser: Parser, text: string): void {
  const iterator = newlineIterator(text);
  let next = iterator.next();
  while (!next.done) {
    parser.push(next.value);
    next = iterator.next();
  }
  if (!parser.done()) parser.push(null);
}
