import newlineIterator from 'newline-iterator';
import type { IParser } from './types.js';

export default function parseText(parser: IParser, text: string): void {
  const iterator = newlineIterator(text);
  let next = iterator.next();
  while (!next.done) {
    parser.push(next.value);
    next = iterator.next();
  }
  if (!parser.done()) parser.push(null);
}
