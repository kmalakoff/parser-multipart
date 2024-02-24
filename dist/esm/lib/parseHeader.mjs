export default function parseHeader(result, line, delimiter) {
    const index = line.indexOf(delimiter);
    if (index === -1) throw new Error(`Unexpected header format: ${line}`);
    const key = line.slice(0, index);
    const value = line.slice(index + 1);
    result[key.trim().toLowerCase()] = value.trim();
}
