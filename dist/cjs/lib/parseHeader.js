"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = parseHeader;
function parseHeader(result, line, delimiter) {
    var index = line.indexOf(delimiter);
    if (index === -1) throw new Error("Unexpected header format: ".concat(line));
    var key = line.slice(0, index);
    var value = line.slice(index + 1);
    result[key.trim().toLowerCase()] = value.trim();
}
