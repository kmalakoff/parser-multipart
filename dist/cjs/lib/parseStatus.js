// @ts-ignore
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return parseStatus;
    }
});
// https://github.com/watson/http-headers/blob/master/index.ts
var statusLine = /^[A-Z]+\/(\d)\.(\d) (\d{3}) (.*)$/;
function parseStatus(result, line) {
    var match = line.match(statusLine);
    if (!match) return false;
    result.version = {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10)
    };
    result.status = parseInt(match[3], 10);
    result.statusText = match[4];
    result.ok = result.statusText === "OK";
    return true;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}