/**
 * Node 0.8 compatible Object.entries/keys/values polyfill
 */
export function entries<T>(obj: Record<string, T>): [string, T][] {
  const result: [string, T][] = [];
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    result.push([key, obj[key]]);
  }
  return result;
}

export function keys(obj: Record<string, unknown>): string[] {
  const result: string[] = [];
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    result.push(key);
  }
  return result;
}

export function values<T>(obj: Record<string, T>): T[] {
  const result: T[] = [];
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    result.push(obj[key]);
  }
  return result;
}
