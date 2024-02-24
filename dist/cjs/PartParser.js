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
        return MultipartPart;
    }
});
var _ResponseParserts = /*#__PURE__*/ _interop_require_default(require("./ResponseParser.js"));
var _parseHeaderts = /*#__PURE__*/ _interop_require_default(require("./lib/parseHeader.js"));
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
    ParseStatus[ParseStatus["Response"] = 2] = "Response";
})(ParseStatus || (ParseStatus = {}));
var MultipartPart = /*#__PURE__*/ function() {
    "use strict";
    function MultipartPart() {
        _class_call_check(this, MultipartPart);
        _define_property(this, "headers", {});
        _define_property(this, "_response", void 0);
        _define_property(this, "_parsingState", {
            status: 1
        });
    }
    _create_class(MultipartPart, [
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
                if (!this._parsingState) throw new Error("Attempting to parse a completed part");
                if (line === null) {
                    if (this._parsingState.status !== 2) throw new Error("Unexpected parsing state");
                    if (!this._response.done()) this._response.push(null);
                    this._parsingState = null;
                    return;
                }
                if (this._parsingState.status === 1) {
                    if (!line.length) {
                        if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
                        this._parsingState.status = 2;
                        this._response = new _ResponseParserts.default(this.headers["content-type"]);
                    } else (0, _parseHeaderts.default)(this.headers, line, ":");
                } else if (this._parsingState.status === 2) {
                    this._response.push(line);
                }
            }
        },
        {
            key: "response",
            get: function get() {
                if (this._parsingState) throw new Error("Attempting to use an incomplete part");
                return this._response.response;
            }
        }
    ]);
    return MultipartPart;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }