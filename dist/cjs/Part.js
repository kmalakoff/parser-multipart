"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = exports.ParseStatus = void 0;
var _parseHeaderJs = _interopRequireDefault(require("./lib/parseHeader.js"));
var _parseTextJs = _interopRequireDefault(require("./lib/parseText.js"));
var _responseJs = _interopRequireDefault(require("./Response.js"));
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
    ParseStatus[ParseStatus["Response"] = 2] = "Response";
})(ParseStatus || (exports.ParseStatus = ParseStatus = {}));
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
        (0, _parseTextJs).default(this, text);
    };
    _proto.push = function push(line) {
        if (!this._parsingState) throw new Error("Attempting to parse a completed part");
        if (line === null) {
            if (this._parsingState.status !== ParseStatus.Response) throw new Error("Unexpected parsing state");
            if (!this.response.done()) this.response.push(null);
            this._parsingState = null;
            return;
        }
        if (this._parsingState.status === ParseStatus.Headers) {
            if (!line.length) {
                if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
                this._parsingState.status = ParseStatus.Response;
                this.response = new _responseJs.default(this.headers["content-type"]);
            } else (0, _parseHeaderJs).default(this.headers, line, ":");
        } else if (this._parsingState.status === ParseStatus.Response) {
            this.response.push(line);
        }
    };
    return MultipartPart;
}();
module.exports = MultipartPart;
