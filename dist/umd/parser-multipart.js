(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('newline-iterator')) :
    typeof define === 'function' && define.amd ? define(['exports', 'newline-iterator'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.parserMultipart = {}, global.newlineIterator));
})(this, (function (exports, newlineIterator) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var newlineIterator__default = /*#__PURE__*/_interopDefaultLegacy(newlineIterator);

    function parseHeader(result, line, delimiter) {
        var index = line.indexOf(delimiter);
        if (index === -1)
            throw new Error("Unexpected header format: ".concat(line));
        var key = line.slice(0, index);
        var value = line.slice(index + 1);
        result[key.trim().toLowerCase()] = value.trim();
    }

    function parseText(parser, text) {
        var iterator = newlineIterator__default["default"](text);
        var next = iterator.next();
        while (!next.done) {
            parser.push(next.value);
            next = iterator.next();
        }
        if (!parser.done())
            parser.push(null);
    }

    // https://github.com/watson/http-headers/blob/master/index.js
    var statusLine = /^[A-Z]+\/(\d)\.(\d) (\d{3}) (.*)$/;
    function parseStatus(result, line) {
        var match = line.match(statusLine);
        if (!match)
            return false;
        result.version = { major: parseInt(match[1], 10), minor: parseInt(match[2], 10) };
        result.status = parseInt(match[3], 10);
        result.statusText = match[4];
        result.ok = result.statusText === 'OK';
        return true;
    }

    var ParseStatus$2;
    (function (ParseStatus) {
        ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
        ParseStatus[ParseStatus["Body"] = 2] = "Body";
    })(ParseStatus$2 || (ParseStatus$2 = {}));
    var BodyHeaders = /** @class */ (function () {
        function BodyHeaders() {
            this.headers = {};
        }
        return BodyHeaders;
    }());
    var MultipartResponse = /** @class */ (function () {
        function MultipartResponse(contentType) {
            this.headers = null;
            this.body = null;
            this._parsingState = {
                status: ParseStatus$2.Body,
                lines: [],
            };
            if (contentType === undefined)
                throw new Error('Response missing a content type');
            this.contentType = contentType;
            if (this.contentType === 'application/http') {
                this.headers = new BodyHeaders();
                this._parsingState.status = ParseStatus$2.Headers;
            }
        }
        MultipartResponse.prototype.done = function () {
            return !this._parsingState;
        };
        MultipartResponse.prototype.parse = function (text) {
            parseText(this, text);
        };
        MultipartResponse.prototype.push = function (line) {
            if (!this._parsingState)
                throw new Error('Attempting to parse a completed response');
            if (line === null) {
                if (this._parsingState.status !== ParseStatus$2.Body)
                    throw new Error('Unexpected parsing state');
                this.body = this._parsingState.lines.join('\r\n');
                this._parsingState = null;
                return;
            }
            if (this._parsingState.status === ParseStatus$2.Headers) {
                if (!line.length)
                    this._parsingState.status = ParseStatus$2.Body;
                else if (!parseStatus(this.headers, line))
                    parseHeader(this.headers.headers, line, ':');
            }
            else if (this._parsingState.status === ParseStatus$2.Body) {
                if (!line.length)
                    this.push(null);
                else
                    this._parsingState.lines.push(line);
            }
        };
        MultipartResponse.prototype.text = function () {
            if (this._parsingState)
                throw new Error('Attempting to use an incomplete response');
            return this.body;
        };
        MultipartResponse.prototype.json = function () {
            if (this._parsingState)
                throw new Error('Attempting to use an incomplete response');
            return JSON.parse(this.body);
        };
        return MultipartResponse;
    }());

    var ParseStatus$1;
    (function (ParseStatus) {
        ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
        ParseStatus[ParseStatus["Response"] = 2] = "Response";
    })(ParseStatus$1 || (ParseStatus$1 = {}));
    var MultipartPart = /** @class */ (function () {
        function MultipartPart() {
            this.headers = {};
            this._parsingState = {
                status: ParseStatus$1.Headers,
            };
        }
        MultipartPart.prototype.done = function () {
            return !this._parsingState;
        };
        MultipartPart.prototype.parse = function (text) {
            parseText(this, text);
        };
        MultipartPart.prototype.push = function (line) {
            if (!this._parsingState)
                throw new Error('Attempting to parse a completed part');
            if (line === null) {
                if (this._parsingState.status !== ParseStatus$1.Response)
                    throw new Error('Unexpected parsing state');
                if (!this.response.done())
                    this.response.push(null);
                this._parsingState = null;
                return;
            }
            if (this._parsingState.status === ParseStatus$1.Headers) {
                if (!line.length) {
                    if (this.headers['content-type'] === undefined)
                        throw new Error('Missing content type');
                    this._parsingState.status = ParseStatus$1.Response;
                    this.response = new MultipartResponse(this.headers['content-type']);
                }
                else
                    parseHeader(this.headers, line, ':');
            }
            else if (this._parsingState.status === ParseStatus$1.Response) {
                this.response.push(line);
            }
        };
        return MultipartPart;
    }());

    var ParseStatus;
    (function (ParseStatus) {
        ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
    })(ParseStatus || (ParseStatus = {}));
    var MultipartParser = /** @class */ (function () {
        function MultipartParser(headers) {
            var _this = this;
            this.headers = {};
            this.parts = [];
            this._parsingState = {
                status: ParseStatus.Parts,
                boundaryEnd: null,
            };
            this.boundary = null;
            if (!headers)
                throw new Error('Headers missing');
            var contentType;
            if (typeof headers === 'string')
                contentType = headers;
            /* c8 ignore start */ else if (headers.get)
                contentType = headers.get('content-type');
            /* c8 ignore stop */ else
                contentType = headers['content-type'];
            if (!contentType)
                throw Error('content-type header not found');
            var parts = contentType.split(/;/g);
            this.type = parts.shift().trim();
            if (this.type.indexOf('multipart') !== 0) {
                throw new Error("Expecting a multipart type. Received: ".concat(contentType));
            }
            parts.forEach(function (part) { return parseHeader(_this.headers, part, '='); });
            // boundary
            if (!this.headers.boundary)
                throw new Error('Invalid Content Type: no boundary');
            this.boundary = "--".concat(this.headers.boundary);
            this._parsingState.boundaryEnd = "--".concat(this.headers.boundary, "--");
            this._parsingState.status = ParseStatus.Parts;
        }
        MultipartParser.prototype.done = function () {
            return !this._parsingState;
        };
        MultipartParser.prototype.parse = function (text) {
            parseText(this, text);
        };
        MultipartParser.prototype.push = function (line) {
            var part = this.parts.length ? this.parts[this.parts.length - 1] : null;
            if (!this._parsingState)
                throw new Error('Attempting to parse a completed multipart');
            if (line === null) {
                if (part && !part.done())
                    part.push(null);
                this._parsingState = null;
                return;
            }
            if (line === this._parsingState.boundaryEnd)
                this.push(null);
            else if (line === this.boundary) {
                if (part && !part.done())
                    part.push(null);
                this.parts.push(new MultipartPart());
            }
            else if (part)
                part.push(line);
            else {
                if (line.length)
                    throw new Error("Unexpected line: ".concat(line));
            }
        };
        return MultipartParser;
    }());

    exports.Parser = MultipartParser;
    exports.Part = MultipartPart;
    exports.Response = MultipartResponse;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=parser-multipart.js.map
