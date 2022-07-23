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
        return MultipartParser;
    }
});
var _partTs = /*#__PURE__*/ _interopRequireDefault(require("./Part.js"));
var _parseHeaderTs = /*#__PURE__*/ _interopRequireDefault(require("./lib/parseHeader.js"));
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
    ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
})(ParseStatus || (ParseStatus = {}));
var MultipartParser = /*#__PURE__*/ function() {
    "use strict";
    function MultipartParser(headers) {
        var _this = this;
        _classCallCheck(this, MultipartParser);
        this.headers = {};
        this.parts = [];
        this._parsingState = {
            status: ParseStatus.Parts,
            boundaryEnd: null
        };
        this.boundary = null;
        if (!headers) throw new Error("Headers missing");
        var contentType;
        if (typeof headers === "string") contentType = headers;
        else if (headers.get) contentType = headers.get("content-type");
        else contentType = headers["content-type"];
        if (!contentType) throw Error("content-type header not found");
        var parts = contentType.split(/;/g);
        this.type = parts.shift().trim();
        if (this.type.indexOf("multipart") !== 0) {
            throw new Error("Expecting a multipart type. Received: ".concat(contentType));
        }
        parts.forEach(function(part) {
            return (0, _parseHeaderTs.default)(_this.headers, part, "=");
        });
        // boundary
        if (!this.headers.boundary) throw new Error("Invalid Content Type: no boundary");
        this.boundary = "--".concat(this.headers.boundary);
        this._parsingState.boundaryEnd = "--".concat(this.headers.boundary, "--");
        this._parsingState.status = ParseStatus.Parts;
    }
    var _proto = MultipartParser.prototype;
    _proto.done = function done() {
        return !this._parsingState;
    };
    _proto.parse = function parse(text) {
        (0, _parseTextTs.default)(this, text);
    };
    _proto.push = function push(line) {
        var part = this.parts.length ? this.parts[this.parts.length - 1] : null;
        if (!this._parsingState) throw new Error("Attempting to parse a completed multipart");
        if (line === null) {
            if (part && !part.done()) part.push(null);
            this._parsingState = null;
            return;
        }
        if (line === this._parsingState.boundaryEnd) this.push(null);
        else if (line === this.boundary) {
            if (part && !part.done()) part.push(null);
            this.parts.push(new _partTs.default());
        } else if (part) part.push(line);
        else {
            if (line.length) throw new Error("Unexpected line: ".concat(line));
        }
    };
    return MultipartParser;
}();

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}