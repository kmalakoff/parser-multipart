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
var _PartParserts = /*#__PURE__*/ _interop_require_default(require("./PartParser.js"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ParseStatus = /*#__PURE__*/ function(ParseStatus) {
    ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
    return ParseStatus;
}({});
var MultipartParser = /*#__PURE__*/ function() {
    "use strict";
    function MultipartParser(headers) {
        var _this = this;
        _class_call_check(this, MultipartParser);
        this.headers = {};
        this.parts = [];
        this._parsingState = {
            status: 1,
            boundaryEnd: null
        };
        this.boundary = null;
        if (!headers) throw new Error('Headers missing');
        var contentType;
        if (typeof headers === 'string') contentType = headers;
        else if (headers.get) contentType = headers.get('content-type');
        else contentType = headers['content-type'];
        if (!contentType) throw Error('content-type header not found');
        var parts = contentType.split(/;/g);
        this.type = parts.shift().trim();
        if (this.type.indexOf('multipart') !== 0) {
            throw new Error("Expecting a multipart type. Received: ".concat(contentType));
        }
        parts.forEach(function(part) {
            return (0, _parseHeaderts.default)(_this.headers, part, '=');
        });
        // boundary
        if (!this.headers.boundary) throw new Error('Invalid Content Type: no boundary');
        this.boundary = "--".concat(this.headers.boundary);
        this._parsingState.boundaryEnd = "--".concat(this.headers.boundary, "--");
        this._parsingState.status = 1;
    }
    var _proto = MultipartParser.prototype;
    _proto.done = function done() {
        return !this._parsingState;
    };
    _proto.parse = function parse(text) {
        (0, _parseTextts.default)(this, text);
        return this;
    };
    _proto.push = function push(line) {
        var part = this.parts.length ? this.parts[this.parts.length - 1] : null;
        if (!this._parsingState) throw new Error('Attempting to parse a completed multipart');
        if (line === null) {
            if (part && !part.done()) part.push(null);
            this._parsingState = null;
            return;
        }
        if (line === this._parsingState.boundaryEnd) this.push(null);
        else if (line === this.boundary) {
            if (part && !part.done()) part.push(null);
            this.parts.push(new _PartParserts.default());
        } else if (part) part.push(line);
        else {
            if (line.length) throw new Error("Unexpected line: ".concat(line));
        }
    };
    _create_class(MultipartParser, [
        {
            key: "responses",
            get: function get() {
                if (this._parsingState) throw new Error('Attempting to use an incomplete parser');
                return this.parts.map(function(part) {
                    return part.response;
                });
            }
        }
    ]);
    return MultipartParser;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }