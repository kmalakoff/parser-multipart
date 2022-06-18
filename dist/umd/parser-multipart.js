(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('newline-iterator')) :
  typeof define === 'function' && define.amd ? define(['exports', 'newline-iterator'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.parserMultipart = {}, global.newlineIterator));
})(this, (function (exports, newlineIterator) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var newlineIterator__default = /*#__PURE__*/_interopDefaultLegacy(newlineIterator);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
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
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function parseHeader(result, line, delimiter) {
    var index = line.indexOf(delimiter);
    if (index === -1) throw new Error("Unexpected header format: ".concat(line));
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

    if (!parser.done()) parser.push(null);
  }

  // https://github.com/watson/http-headers/blob/master/index.js
  var statusLine = /^[A-Z]+\/(\d)\.(\d) (\d{3}) (.*)$/;
  function parseStatus(result, line) {
    var match = line.match(statusLine);
    if (!match) return false;
    result.version = {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10)
    };
    result.status = parseInt(match[3], 10);
    result.statusText = match[4];
    result.ok = result.statusText === "OK";
    return true;
  }

  var ParseStatus$2;

  (function (ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Body"] = 2] = "Body";
  })(ParseStatus$2 || (ParseStatus$2 = {}));

  var BodyHeaders = /*#__PURE__*/_createClass(function BodyHeaders() {
    _classCallCheck(this, BodyHeaders);

    _defineProperty(this, "version", void 0);

    _defineProperty(this, "headers", {});

    _defineProperty(this, "ok", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "statusText", void 0);
  });

  var MultipartResponse = /*#__PURE__*/function () {
    function MultipartResponse(contentType) {
      _classCallCheck(this, MultipartResponse);

      _defineProperty(this, "contentType", void 0);

      _defineProperty(this, "headers", null);

      _defineProperty(this, "body", null);

      _defineProperty(this, "_parsingState", {
        status: ParseStatus$2.Body,
        lines: []
      });

      if (contentType === undefined) throw new Error("Response missing a content type");
      this.contentType = contentType;

      if (this.contentType === "application/http") {
        this.headers = new BodyHeaders();
        this._parsingState.status = ParseStatus$2.Headers;
      }
    }

    _createClass(MultipartResponse, [{
      key: "done",
      value: function done() {
        return !this._parsingState;
      }
    }, {
      key: "parse",
      value: function parse(text) {
        parseText(this, text);
      }
    }, {
      key: "push",
      value: function push(line) {
        if (!this._parsingState) throw new Error("Attempting to parse a completed response");

        if (line === null) {
          if (this._parsingState.status !== ParseStatus$2.Body) throw new Error("Unexpected parsing state");
          this.body = this._parsingState.lines.join("\r\n");
          this._parsingState = null;
          return;
        }

        if (this._parsingState.status === ParseStatus$2.Headers) {
          if (!line.length) this._parsingState.status = ParseStatus$2.Body;else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ":");
        } else if (this._parsingState.status === ParseStatus$2.Body) {
          if (!line.length) this.push(null);else this._parsingState.lines.push(line);
        }
      }
    }, {
      key: "text",
      value: function text() {
        if (this._parsingState) throw new Error("Attempting to use an incomplete response");
        return this.body;
      }
    }, {
      key: "json",
      value: function json() {
        if (this._parsingState) throw new Error("Attempting to use an incomplete response");
        return JSON.parse(this.body);
      }
    }]);

    return MultipartResponse;
  }();

  var ParseStatus$1;

  (function (ParseStatus) {
    ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
    ParseStatus[ParseStatus["Response"] = 2] = "Response";
  })(ParseStatus$1 || (ParseStatus$1 = {}));

  var MultipartPart = /*#__PURE__*/function () {
    function MultipartPart() {
      _classCallCheck(this, MultipartPart);

      _defineProperty(this, "headers", {});

      _defineProperty(this, "response", void 0);

      _defineProperty(this, "_parsingState", {
        status: ParseStatus$1.Headers
      });
    }

    _createClass(MultipartPart, [{
      key: "done",
      value: function done() {
        return !this._parsingState;
      }
    }, {
      key: "parse",
      value: function parse(text) {
        parseText(this, text);
      }
    }, {
      key: "push",
      value: function push(line) {
        if (!this._parsingState) throw new Error("Attempting to parse a completed part");

        if (line === null) {
          if (this._parsingState.status !== ParseStatus$1.Response) throw new Error("Unexpected parsing state");
          if (!this.response.done()) this.response.push(null);
          this._parsingState = null;
          return;
        }

        if (this._parsingState.status === ParseStatus$1.Headers) {
          if (!line.length) {
            if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
            this._parsingState.status = ParseStatus$1.Response;
            this.response = new MultipartResponse(this.headers["content-type"]);
          } else parseHeader(this.headers, line, ":");
        } else if (this._parsingState.status === ParseStatus$1.Response) {
          this.response.push(line);
        }
      }
    }]);

    return MultipartPart;
  }();

  var ParseStatus;

  (function (ParseStatus) {
    ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
  })(ParseStatus || (ParseStatus = {}));

  var MultipartParser = /*#__PURE__*/function () {
    function MultipartParser(headers) {
      _classCallCheck(this, MultipartParser);

      _defineProperty(this, "type", void 0);

      _defineProperty(this, "headers", {});

      _defineProperty(this, "parts", []);

      _defineProperty(this, "_parsingState", {
        status: ParseStatus.Parts,
        boundaryEnd: null
      });

      _defineProperty(this, "boundary", null);

      if (!headers) throw new Error("Headers missing");
      var contentType;
      if (typeof headers === "string") contentType = headers;
      /* c8 ignore start */
      else if (headers.get) contentType = headers.get("content-type");
      /* c8 ignore stop */
      else contentType = headers["content-type"];
      if (!contentType) throw Error("content-type header not found");
      var parts = contentType.split(/;/g);
      this.type = parts.shift().trim();

      if (this.type.indexOf("multipart") !== 0) {
        throw new Error("Expecting a multipart type. Received: ".concat(contentType));
      }

      var _iterator = _createForOfIteratorHelper(parts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var part = _step.value;
          parseHeader(this.headers, part, "=");
        } // boundary

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!this.headers.boundary) throw new Error("Invalid Content Type: no boundary");
      this.boundary = "--".concat(this.headers.boundary);
      this._parsingState.boundaryEnd = "--".concat(this.headers.boundary, "--");
      this._parsingState.status = ParseStatus.Parts;
    }

    _createClass(MultipartParser, [{
      key: "done",
      value: function done() {
        return !this._parsingState;
      }
    }, {
      key: "parse",
      value: function parse(text) {
        parseText(this, text);
      }
    }, {
      key: "push",
      value: function push(line) {
        var part = this.parts.length ? this.parts[this.parts.length - 1] : null;
        if (!this._parsingState) throw new Error("Attempting to parse a completed multipart");

        if (line === null) {
          if (part && !part.done()) part.push(null);
          this._parsingState = null;
          return;
        }

        if (line === this._parsingState.boundaryEnd) this.push(null);else if (line === this.boundary) {
          if (part && !part.done()) part.push(null);
          this.parts.push(new MultipartPart());
        } else if (part) part.push(line);else {
          if (line.length) throw new Error("Unexpected line: ".concat(line));
        }
      }
    }]);

    return MultipartParser;
  }();

  exports.Parser = MultipartParser;
  exports.Part = MultipartPart;
  exports.Response = MultipartResponse;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=parser-multipart.js.map
