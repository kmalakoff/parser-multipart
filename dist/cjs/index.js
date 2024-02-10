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
        return _multipartParserTs.default;
    },
    Part: function() {
        return _partParserTs.default;
    },
    Response: function() {
        return _responseParserTs.default;
    }
});
var _multipartParserTs = /*#__PURE__*/ _interopRequireDefault(require("./MultipartParser.js"));
var _partParserTs = /*#__PURE__*/ _interopRequireDefault(require("./PartParser.js"));
var _responseParserTs = /*#__PURE__*/ _interopRequireDefault(require("./ResponseParser.js"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}