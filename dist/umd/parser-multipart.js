(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.parserMultipart = {}));
})(this, (function (exports) { 'use strict';

  function _classCallCheck$5(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  var HeadersPolyfill = /*#__PURE__*/ function() {
      function HeadersPolyfill(headers) {
          _classCallCheck$5(this, HeadersPolyfill);
          this.headers = headers;
      }
      var _proto = HeadersPolyfill.prototype;
      _proto.get = function get(key) {
          return this.headers[key];
      };
      _proto.set = function set(key, value) {
          this.headers[key] = value;
      };
      _proto.append = function append(key, value) {
          this.headers[key] = value;
      };
      _proto.delete = function _delete(key) {
          delete this.headers[key];
      };
      _proto.has = function has(key) {
          return this.headers[key] === undefined;
      };
      _proto.forEach = function forEach(fn) {
          for(var key in this.headers)fn(this.headers[key]);
      };
      _proto.getSetCookie = function getSetCookie() {
          throw new Error("Unsupported: getSetCookie");
      };
      return HeadersPolyfill;
  }();
  var HeadersPolyfill$1 = typeof Headers === "undefined" ? HeadersPolyfill : Headers;

  // @ts-ignore
  function _classCallCheck$4(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$3(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _createClass$3(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$3(Constructor, staticProps);
      return Constructor;
  }
  var ParsedResponse = /*#__PURE__*/ function() {
      function ParsedResponse(parser) {
          _classCallCheck$4(this, ParsedResponse);
          this._parser = parser;
          this._bodyUsed = false;
      }
      var _proto = ParsedResponse.prototype;
      _proto.clone = function clone() {
          return new ParsedResponse(this._parser);
      };
      _proto.text = function text() {
          if (this._bodyUsed) throw new Error("Body already consumed");
          this._bodyUsed = true;
          return Promise.resolve(this._parser.body);
      };
      _proto.json = function json() {
          if (this._bodyUsed) throw new Error("Body already consumed");
          this._bodyUsed = true;
          return Promise.resolve(JSON.parse(this._parser.body));
      };
      _proto.arrayBuffer = function arrayBuffer() {
          throw new Error("Unsupported: arrayBuffer");
      };
      _proto.blob = function blob() {
          throw new Error("Unsupported: blob");
      };
      _proto.formData = function formData() {
          throw new Error("Unsupported: formData");
      };
      _createClass$3(ParsedResponse, [
          {
              key: "type",
              get: function get() {
                  return "default";
              }
          },
          {
              key: "headers",
              get: function get() {
                  return new HeadersPolyfill$1(this._parser.headers.headers);
              }
          },
          {
              key: "body",
              get: function get() {
                  throw new Error("Not supported: body");
              }
          },
          {
              key: "ok",
              get: function get() {
                  return this._parser.headers.ok;
              }
          },
          {
              key: "status",
              get: function get() {
                  return this._parser.headers.status;
              }
          },
          {
              key: "statusText",
              get: function get() {
                  return this._parser.headers.statusText;
              }
          },
          {
              key: "redirected",
              get: function get() {
                  return false;
              }
          },
          {
              key: "url",
              get: function get() {
                  return "";
              }
          },
          {
              key: "bodyUsed",
              get: function get() {
                  return this._bodyUsed;
              }
          }
      ]);
      return ParsedResponse;
  }();

  // @ts-ignore
  function _classCallCheck$3(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  var BodyHeaders = function BodyHeaders() {
      _classCallCheck$3(this, BodyHeaders);
      this.headers = {};
  };

  function parseHeader(result, line, delimiter) {
      var index = line.indexOf(delimiter);
      if (index === -1) throw new Error("Unexpected header format: ".concat(line));
      var key = line.slice(0, index);
      var value = line.slice(index + 1);
      result[key.trim().toLowerCase()] = value.trim();
  }

  // @ts-ignore
  // https://github.com/watson/http-headers/blob/master/index.ts
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

  /**
   * Find indexOf CR, LF, or CRLF
   *
   * @param string The search string
   * @param offset The offset for searching
   * @param includeLength Include the length in the return value
   * @returns When includeLength is true, returns a pair of [offset, length] to provide the length of CR (1), LF (1) or CRLF (2)
   */ function indexOfNewline(string) {
      var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, includeLength = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      if (offset < 0) throw new Error("Unexpected negative offset");
      if (offset > string.length) throw new Error("Offset is longer than the string. Offset: ".concat(offset, ". String: ").concat(string.length));
      while(offset < string.length){
          var value = string[offset];
          if (value === "\n") return includeLength ? [
              offset,
              1
          ] : offset;
          else if (value === "\r") {
              return includeLength ? [
                  offset,
                  string[offset + 1] === "\n" ? 2 : 1
              ] : offset;
          }
          offset++;
      }
      return includeLength ? [
          -1,
          0
      ] : -1;
  }

  var hasIterator = typeof Symbol !== "undefined" && Symbol.iterator;
  /**
   * Create a newline iterator recognizing CR, LF, and CRLF using the Symbol.iterator interface
   *
   * @param string The string to iterate through
   *
   * ```typescript
   * import newlineIterator from "newline-iterator";
   *
   * const iterator = newlineIterator("some\r\nstring\ncombination\r");
   * const results = [];
   * for (const line of iterator) results.push(line);
   * console.log(results); // ["some", "string", "combination"];
   * ```
   */ function newlineIterator(string) {
      var offset = 0;
      var iterator = {
          next: function next() {
              if (offset >= string.length) return {
                  value: undefined,
                  done: true
              };
              var args = indexOfNewline(string, offset, true);
              var index = args[0];
              var skip = args[1];
              if (index < 0) {
                  index = string.length;
                  skip = 0;
              }
              var line = string.substr(offset, index - offset);
              offset = index + skip;
              return {
                  value: line,
                  done: false
              };
          }
      };
      if (hasIterator) {
          iterator[Symbol.iterator] = function() {
              return this;
          };
      }
      return iterator;
  }

  function parseText(parser, text) {
      var iterator = newlineIterator(text);
      var next = iterator.next();
      while(!next.done){
          parser.push(next.value);
          next = iterator.next();
      }
      if (!parser.done()) parser.push(null);
  }

  // @ts-ignore
  function _classCallCheck$2(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$2(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _createClass$2(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$2(Constructor, staticProps);
      return Constructor;
  }
  var ParseStatus$2;
  (function(ParseStatus) {
      ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
      ParseStatus[ParseStatus["Body"] = 2] = "Body";
  })(ParseStatus$2 || (ParseStatus$2 = {}));
  var MultipartResponse = /*#__PURE__*/ function() {
      function MultipartResponse(contentType) {
          _classCallCheck$2(this, MultipartResponse);
          this.headers = null;
          this.body = null;
          this._parsingState = {
              status: ParseStatus$2.Body,
              lines: []
          };
          if (contentType === undefined) throw new Error("Response missing a content type");
          this.contentType = contentType;
          if (this.contentType === "application/http") {
              this.headers = new BodyHeaders();
              this._parsingState.status = ParseStatus$2.Headers;
          }
      }
      var _proto = MultipartResponse.prototype;
      _proto.done = function done() {
          return !this._parsingState;
      };
      _proto.parse = function parse(text) {
          parseText(this, text);
      };
      _proto.push = function push(line) {
          if (!this._parsingState) throw new Error("Attempting to parse a completed response");
          if (line === null) {
              if (this._parsingState.status !== ParseStatus$2.Body) throw new Error("Unexpected parsing state");
              this.body = this._parsingState.lines.join("\r\n");
              this._parsingState = null;
              return;
          }
          if (this._parsingState.status === ParseStatus$2.Headers) {
              if (!line.length) this._parsingState.status = ParseStatus$2.Body;
              else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ":");
          } else if (this._parsingState.status === ParseStatus$2.Body) {
              if (!line.length) this.push(null);
              else this._parsingState.lines.push(line);
          }
      };
      _createClass$2(MultipartResponse, [
          {
              key: "response",
              get: function get() {
                  if (this._parsingState) throw new Error("Attempting to use an incomplete response");
                  return new ParsedResponse(this);
              }
          }
      ]);
      return MultipartResponse;
  }();

  // @ts-ignore
  function _classCallCheck$1(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$1(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _createClass$1(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$1(Constructor, staticProps);
      return Constructor;
  }
  var ParseStatus$1;
  (function(ParseStatus) {
      ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
      ParseStatus[ParseStatus["Response"] = 2] = "Response";
  })(ParseStatus$1 || (ParseStatus$1 = {}));
  var MultipartPart = /*#__PURE__*/ function() {
      function MultipartPart() {
          _classCallCheck$1(this, MultipartPart);
          this.headers = {};
          this._parsingState = {
              status: ParseStatus$1.Headers
          };
      }
      var _proto = MultipartPart.prototype;
      _proto.done = function done() {
          return !this._parsingState;
      };
      _proto.parse = function parse(text) {
          parseText(this, text);
      };
      _proto.push = function push(line) {
          if (!this._parsingState) throw new Error("Attempting to parse a completed part");
          if (line === null) {
              if (this._parsingState.status !== ParseStatus$1.Response) throw new Error("Unexpected parsing state");
              if (!this._response.done()) this._response.push(null);
              this._parsingState = null;
              return;
          }
          if (this._parsingState.status === ParseStatus$1.Headers) {
              if (!line.length) {
                  if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
                  this._parsingState.status = ParseStatus$1.Response;
                  this._response = new MultipartResponse(this.headers["content-type"]);
              } else parseHeader(this.headers, line, ":");
          } else if (this._parsingState.status === ParseStatus$1.Response) {
              this._response.push(line);
          }
      };
      _createClass$1(MultipartPart, [
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

  // @ts-ignore
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
  var ParseStatus;
  (function(ParseStatus) {
      ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
  })(ParseStatus || (ParseStatus = {}));
  var MultipartParser = /*#__PURE__*/ function() {
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
              return parseHeader(_this.headers, part, "=");
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
          parseText(this, text);
          return this;
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
              this.parts.push(new MultipartPart());
          } else if (part) part.push(line);
          else {
              if (line.length) throw new Error("Unexpected line: ".concat(line));
          }
      };
      _createClass(MultipartParser, [
          {
              key: "responses",
              get: function get() {
                  if (this._parsingState) throw new Error("Attempting to use an incomplete parser");
                  return this.parts.map(function(part) {
                      return part.response;
                  });
              }
          }
      ]);
      return MultipartParser;
  }();

  exports.Parser = MultipartParser;
  exports.Part = MultipartPart;
  exports.Response = MultipartResponse;
  exports.ResponseParsed = ParsedResponse;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=parser-multipart.js.map
