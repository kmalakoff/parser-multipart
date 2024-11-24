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
    BodyHeaders: function() {
        return _BodyHeadersts.default;
    },
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
var _BodyHeadersts = /*#__PURE__*/ _interop_require_default(require("./lib/BodyHeaders.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }