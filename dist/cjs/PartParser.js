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
var _ResponseParser = /*#__PURE__*/ _interop_require_default(require("./ResponseParser.js"));
var _parseHeader = /*#__PURE__*/ _interop_require_default(require("./lib/parseHeader.js"));
var _parseText = /*#__PURE__*/ _interop_require_default(require("./lib/parseText.js"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ParseStatus = /*#__PURE__*/ function(ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Response"] = 2] = "Response";
    return ParseStatus;
}({});
var MultipartPart = /*#__PURE__*/ function() {
    "use strict";
    function MultipartPart() {
        _class_call_check(this, MultipartPart);
        this.headers = {};
        this._parsingState = {
            status: 1
        };
    }
    var _proto = MultipartPart.prototype;
    _proto.done = function done() {
        return !this._parsingState;
    };
    _proto.parse = function parse(text) {
        (0, _parseText.default)(this, text);
    };
    _proto.push = function push(line) {
        if (!this._parsingState) throw new Error('Attempting to parse a completed part');
        if (line === null) {
            if (this._parsingState.status !== 2) throw new Error('Unexpected parsing state');
            if (!this._response.done()) this._response.push(null);
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === 1) {
            if (!line.length) {
                if (this.headers['content-type'] === undefined) throw new Error('Missing content type');
                this._parsingState.status = 2;
                this._response = new _ResponseParser.default(this.headers['content-type']);
            } else (0, _parseHeader.default)(this.headers, line, ':');
        } else if (this._parsingState.status === 2) {
            this._response.push(line);
        }
    };
    _create_class(MultipartPart, [
        {
            key: "response",
            get: function get() {
                if (this._parsingState) throw new Error('Attempting to use an incomplete part');
                return this._response.response;
            }
        }
    ]);
    return MultipartPart;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }