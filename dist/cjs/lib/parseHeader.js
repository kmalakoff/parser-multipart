"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return parseHeader;
    }
});
function parseHeader(result, line, delimiter) {
    var index = line.indexOf(delimiter);
    if (index === -1) throw new Error("Unexpected header format: ".concat(line));
    var key = line.slice(0, index);
    var value = line.slice(index + 1);
    result[key.trim().toLowerCase()] = value.trim();
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }