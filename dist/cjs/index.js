// @ts-ignore
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Parser: function() {
        return _MultipartParserts.default;
    },
    Part: function() {
        return _PartParserts.default;
    },
    Response: function() {
        return _ResponseParserts.default;
    },
    ResponseParsed: function() {
        return _ResponseParsedts.default;
    }
});
var _MultipartParserts = /*#__PURE__*/ _interop_require_default(require("./MultipartParser.js"));
var _PartParserts = /*#__PURE__*/ _interop_require_default(require("./PartParser.js"));
var _ResponseParserts = /*#__PURE__*/ _interop_require_default(require("./ResponseParser.js"));
var _ResponseParsedts = /*#__PURE__*/ _interop_require_default(require("./ResponseParsed.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}