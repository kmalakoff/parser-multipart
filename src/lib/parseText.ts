import newlineIterator from "newline-iterator";
import { Parser } from "../types";

export default function parseText(parser: Parser, text: string): void {
  const iterator = newlineIterator(text);
  for (const line of iterator) parser.push(line);
  if (!parser.done()) parser.push(null);
}
