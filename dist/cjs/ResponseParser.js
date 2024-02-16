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
    ParseStatus: function() {
        return ParseStatus;
    },
    default: function() {
        return MultipartResponse;
    }
});
var _ResponseParsedts = /*#__PURE__*/ _interop_require_default(require("./ResponseParsed.js"));
var _BodyHeadersts = /*#__PURE__*/ _interop_require_default(require("./lib/BodyHeaders.js"));
var _parseHeaderts = /*#__PURE__*/ _interop_require_default(require("./lib/parseHeader.js"));
var _parseStatusts = /*#__PURE__*/ _interop_require_default(require("./lib/parseStatus.js"));
var _parseTextts = /*#__PURE__*/ _interop_require_default(require("./lib/parseText.js"));
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ParseStatus;
(function(ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus || (ParseStatus = {}));
var MultipartResponse = /*#__PURE__*/ function() {
    "use strict";
    function MultipartResponse(contentType) {
        _class_call_check(this, MultipartResponse);
        _define_property(this, "contentType", void 0);
        _define_property(this, "headers", null);
        _define_property(this, "body", null);
        _define_property(this, "_parsingState", {
            status: 2,
            lines: []
        });
        if (contentType === undefined) throw new Error("Response missing a content type");
        this.contentType = contentType;
        if (this.contentType === "application/http") {
            this.headers = new _BodyHeadersts.default();
            this._parsingState.status = 1;
        }
    }
    _create_class(MultipartResponse, [
        {
            key: "done",
            value: function done() {
                return !this._parsingState;
            }
        },
        {
            key: "parse",
            value: function parse(text) {
                (0, _parseTextts.default)(this, text);
            }
        },
        {
            key: "push",
            value: function push(line) {
                if (!this._parsingState) throw new Error("Attempting to parse a completed response");
                if (line === null) {
                    if (this._parsingState.status !== 2) throw new Error("Unexpected parsing state");
                    this.body = this._parsingState.lines.join("\r\n");
                    this._parsingState = null;
                    return;
                }
                if (this._parsingState.status === 1) {
                    if (!line.length) this._parsingState.status = 2;
                    else if (!(0, _parseStatusts.default)(this.headers, line)) (0, _parseHeaderts.default)(this.headers.headers, line, ":");
                } else if (this._parsingState.status === 2) {
                    if (!line.length) this.push(null);
                    else this._parsingState.lines.push(line);
                }
            }
        },
        {
            key: "response",
            get: function get() {
                if (this._parsingState) throw new Error("Attempting to use an incomplete response");
                return new _ResponseParsedts.default(this);
            }
        }
    ]);
    return MultipartResponse;
}();

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}