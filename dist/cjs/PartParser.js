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
var _responseParserTs = /*#__PURE__*/ _interopRequireDefault(require("./ResponseParser.js"));
var _parseHeaderTs = /*#__PURE__*/ _interopRequireDefault(require("./lib/parseHeader.js"));
var _parseTextTs = /*#__PURE__*/ _interopRequireDefault(require("./lib/parseText.js"));
function _classCallCheck(instance, Constructor) {
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
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _interopRequireDefault(obj) {
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
        _classCallCheck(this, MultipartPart);
        this.headers = {};
        this._parsingState = {
            status: ParseStatus.Headers
        };
    }
    var _proto = MultipartPart.prototype;
    _proto.done = function done() {
        return !this._parsingState;
    };
    _proto.parse = function parse(text) {
        (0, _parseTextTs.default)(this, text);
    };
    _proto.push = function push(line) {
        if (!this._parsingState) throw new Error("Attempting to parse a completed part");
        if (line === null) {
            if (this._parsingState.status !== ParseStatus.Response) throw new Error("Unexpected parsing state");
            if (!this._response.done()) this._response.push(null);
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === ParseStatus.Headers) {
            if (!line.length) {
                if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
                this._parsingState.status = ParseStatus.Response;
                this._response = new _responseParserTs.default(this.headers["content-type"]);
            } else (0, _parseHeaderTs.default)(this.headers, line, ":");
        } else if (this._parsingState.status === ParseStatus.Response) {
            this._response.push(line);
        }
    };
    _createClass(MultipartPart, [
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

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}