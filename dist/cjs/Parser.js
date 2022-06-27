"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = exports.ParseStatus = void 0;
var _partJs = _interopRequireDefault(require("./Part.js"));
var _parseHeaderJs = _interopRequireDefault(require("./lib/parseHeader.js"));
var _parseTextJs = _interopRequireDefault(require("./lib/parseText.js"));
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
exports.ParseStatus = ParseStatus;
(function(ParseStatus) {
    ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
})(ParseStatus || (exports.ParseStatus = ParseStatus = {}));
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
            return (0, _parseHeaderJs).default(_this.headers, part, "=");
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
        (0, _parseTextJs).default(this, text);
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
            this.parts.push(new _partJs.default());
        } else if (part) part.push(line);
        else {
            if (line.length) throw new Error("Unexpected line: ".concat(line));
        }
    };
    return MultipartParser;
}();
module.exports = MultipartParser;
