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
    },
    BodyHeaders: function() {
        return BodyHeaders;
    }
});
var _parseHeaderTs = /*#__PURE__*/ _interopRequireDefault(require("./lib/parseHeader.js"));
var _parseStatusTs = /*#__PURE__*/ _interopRequireDefault(require("./lib/parseStatus.js"));
var _parseTextTs = /*#__PURE__*/ _interopRequireDefault(require("./lib/parseText.js"));
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ParseStatus;
(function(ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus || (ParseStatus = {}));
var BodyHeaders = function BodyHeaders() {
    "use strict";
    _classCallCheck(this, BodyHeaders);
    this.headers = {};
};
var MultipartResponse = /*#__PURE__*/ function() {
    "use strict";
    function MultipartResponse(contentType) {
        _classCallCheck(this, MultipartResponse);
        this.headers = null;
        this.body = null;
        this._parsingState = {
            status: ParseStatus.Body,
            lines: []
        };
        if (contentType === undefined) throw new Error("Response missing a content type");
        this.contentType = contentType;
        if (this.contentType === "application/http") {
            this.headers = new BodyHeaders();
            this._parsingState.status = ParseStatus.Headers;
        }
    }
    var _proto = MultipartResponse.prototype;
    _proto.done = function done() {
        return !this._parsingState;
    };
    _proto.parse = function parse(text) {
        (0, _parseTextTs.default)(this, text);
    };
    _proto.push = function push(line) {
        if (!this._parsingState) throw new Error("Attempting to parse a completed response");
        if (line === null) {
            if (this._parsingState.status !== ParseStatus.Body) throw new Error("Unexpected parsing state");
            this.body = this._parsingState.lines.join("\r\n");
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === ParseStatus.Headers) {
            if (!line.length) this._parsingState.status = ParseStatus.Body;
            else if (!(0, _parseStatusTs.default)(this.headers, line)) (0, _parseHeaderTs.default)(this.headers.headers, line, ":");
        } else if (this._parsingState.status === ParseStatus.Body) {
            if (!line.length) this.push(null);
            else this._parsingState.lines.push(line);
        }
    };
    _proto.text = function text() {
        if (this._parsingState) throw new Error("Attempting to use an incomplete response");
        return this.body;
    };
    _proto.json = function json() {
        if (this._parsingState) throw new Error("Attempting to use an incomplete response");
        return JSON.parse(this.body);
    };
    return MultipartResponse;
}();

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}