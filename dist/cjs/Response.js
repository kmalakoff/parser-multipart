"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = exports.BodyHeaders = exports.ParseStatus = void 0;
var _parseHeaderTs = _interopRequireDefault(require("./lib/parseHeader.js"));
var _parseStatusTs = _interopRequireDefault(require("./lib/parseStatus.js"));
var _parseTextTs = _interopRequireDefault(require("./lib/parseText.js"));
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
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus || (exports.ParseStatus = ParseStatus = {}));
var BodyHeaders = function BodyHeaders() {
    "use strict";
    _classCallCheck(this, BodyHeaders);
    this.headers = {};
};
exports.BodyHeaders = BodyHeaders;
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
        (0, _parseTextTs).default(this, text);
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
            else if (!(0, _parseStatusTs).default(this.headers, line)) (0, _parseHeaderTs).default(this.headers.headers, line, ":");
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
module.exports = MultipartResponse;
