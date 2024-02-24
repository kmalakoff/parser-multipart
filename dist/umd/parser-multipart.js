(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('newline-iterator')) :
  typeof define === 'function' && define.amd ? define(['exports', 'newline-iterator'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.parserMultipart = {}, global.newlineIterator));
})(this, (function (exports, newlineIterator) { 'use strict';

  function _class_call_check$5(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$4(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$4(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$4(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$4(Constructor, staticProps);
      return Constructor;
  }
  function _define_property$5(obj, key, value) {
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
  var HeadersPolyfill = /*#__PURE__*/ function() {
      function HeadersPolyfill(headers) {
          _class_call_check$5(this, HeadersPolyfill);
          _define_property$5(this, "headers", void 0);
          this.headers = headers;
      }
      _create_class$4(HeadersPolyfill, [
          {
              key: "get",
              value: function get(key) {
                  return this.headers[key];
              }
          },
          {
              key: "set",
              value: function set(key, value) {
                  this.headers[key] = value;
              }
          },
          {
              key: "append",
              value: function append(key, value) {
                  this.headers[key] = value;
              }
          },
          {
              key: "delete",
              value: function _delete(key) {
                  delete this.headers[key];
              }
          },
          {
              key: "has",
              value: function has(key) {
                  return this.headers[key] === undefined;
              }
          },
          {
              key: "forEach",
              value: function forEach(fn) {
                  for(var key in this.headers)fn(this.headers[key]);
              }
          },
          {
              key: "getSetCookie",
              value: function getSetCookie() {
                  throw new Error("Unsupported: getSetCookie");
              }
          }
      ]);
      return HeadersPolyfill;
  }();
  var HeadersPolyfill$1 = typeof Headers === "undefined" ? HeadersPolyfill : Headers;

  // @ts-ignore
  function _class_call_check$4(instance, Constructor) {
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
  function _create_class$3(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$3(Constructor, staticProps);
      return Constructor;
  }
  function _define_property$4(obj, key, value) {
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
  var ParsedResponse = /*#__PURE__*/ function() {
      function ParsedResponse(parser) {
          _class_call_check$4(this, ParsedResponse);
          _define_property$4(this, "_parser", void 0);
          _define_property$4(this, "_bodyUsed", void 0);
          this._parser = parser;
          this._bodyUsed = false;
      }
      _create_class$3(ParsedResponse, [
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
              key: "clone",
              value: function clone() {
                  return new ParsedResponse(this._parser);
              }
          },
          {
              key: "bodyUsed",
              get: function get() {
                  return this._bodyUsed;
              }
          },
          {
              key: "text",
              value: function text() {
                  if (this._bodyUsed) throw new Error("Body already consumed");
                  this._bodyUsed = true;
                  return Promise.resolve(this._parser.body);
              }
          },
          {
              key: "json",
              value: function json() {
                  if (this._bodyUsed) throw new Error("Body already consumed");
                  this._bodyUsed = true;
                  return Promise.resolve(JSON.parse(this._parser.body));
              }
          },
          {
              key: "arrayBuffer",
              value: function arrayBuffer() {
                  throw new Error("Unsupported: arrayBuffer");
              }
          },
          {
              key: "blob",
              value: function blob() {
                  throw new Error("Unsupported: blob");
              }
          },
          {
              key: "formData",
              value: function formData() {
                  throw new Error("Unsupported: formData");
              }
          }
      ]);
      return ParsedResponse;
  }();

  // @ts-ignore
  function _class_call_check$3(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _define_property$3(obj, key, value) {
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
  var BodyHeaders = function BodyHeaders() {
      _class_call_check$3(this, BodyHeaders);
      _define_property$3(this, "version", void 0);
      _define_property$3(this, "headers", {});
      _define_property$3(this, "ok", void 0);
      _define_property$3(this, "status", void 0);
      _define_property$3(this, "statusText", void 0);
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
  function _class_call_check$2(instance, Constructor) {
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
  function _create_class$2(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$2(Constructor, staticProps);
      return Constructor;
  }
  function _define_property$2(obj, key, value) {
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
  var ParseStatus$2;
  (function(ParseStatus) {
      ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
      ParseStatus[ParseStatus["Body"] = 2] = "Body";
  })(ParseStatus$2 || (ParseStatus$2 = {}));
  var MultipartResponse = /*#__PURE__*/ function() {
      function MultipartResponse(contentType) {
          _class_call_check$2(this, MultipartResponse);
          _define_property$2(this, "contentType", void 0);
          _define_property$2(this, "headers", null);
          _define_property$2(this, "body", null);
          _define_property$2(this, "_parsingState", {
              status: 2,
              lines: []
          });
          if (contentType === undefined) throw new Error("Response missing a content type");
          this.contentType = contentType;
          if (this.contentType === "application/http") {
              this.headers = new BodyHeaders();
              this._parsingState.status = 1;
          }
      }
      _create_class$2(MultipartResponse, [
          {
              key: "done",
              value: function done() {
                  return !this._parsingState;
              }
          },
          {
              key: "parse",
              value: function parse(text) {
                  parseText(this, text);
              }
          },
          {
              key: "push",
              value: function push(line) {
                  if (!this._parsingState) throw new Error("Attempting to parse a completed response");
                  if (line === null) {
                      if (this._parsingState.status !== 2) throw new Error("Unexpected parsing state");
                      this.body = this._parsingState.lines.join("\r\n");
                      this._parsingState = null;
                      return;
                  }
                  if (this._parsingState.status === 1) {
                      if (!line.length) this._parsingState.status = 2;
                      else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ":");
                  } else if (this._parsingState.status === 2) {
                      if (!line.length) this.push(null);
                      else this._parsingState.lines.push(line);
                  }
              }
          },
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
  function _class_call_check$1(instance, Constructor) {
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
  function _create_class$1(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$1(Constructor, staticProps);
      return Constructor;
  }
  function _define_property$1(obj, key, value) {
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
  var ParseStatus$1;
  (function(ParseStatus) {
      ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
      ParseStatus[ParseStatus["Response"] = 2] = "Response";
  })(ParseStatus$1 || (ParseStatus$1 = {}));
  var MultipartPart = /*#__PURE__*/ function() {
      function MultipartPart() {
          _class_call_check$1(this, MultipartPart);
          _define_property$1(this, "headers", {});
          _define_property$1(this, "_response", void 0);
          _define_property$1(this, "_parsingState", {
              status: 1
          });
      }
      _create_class$1(MultipartPart, [
          {
              key: "done",
              value: function done() {
                  return !this._parsingState;
              }
          },
          {
              key: "parse",
              value: function parse(text) {
                  parseText(this, text);
              }
          },
          {
              key: "push",
              value: function push(line) {
                  if (!this._parsingState) throw new Error("Attempting to parse a completed part");
                  if (line === null) {
                      if (this._parsingState.status !== 2) throw new Error("Unexpected parsing state");
                      if (!this._response.done()) this._response.push(null);
                      this._parsingState = null;
                      return;
                  }
                  if (this._parsingState.status === 1) {
                      if (!line.length) {
                          if (this.headers["content-type"] === undefined) throw new Error("Missing content type");
                          this._parsingState.status = 2;
                          this._response = new MultipartResponse(this.headers["content-type"]);
                      } else parseHeader(this.headers, line, ":");
                  } else if (this._parsingState.status === 2) {
                      this._response.push(line);
                  }
              }
          },
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
  function _define_property(obj, key, value) {
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
  var ParseStatus;
  (function(ParseStatus) {
      ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
  })(ParseStatus || (ParseStatus = {}));
  var MultipartParser = /*#__PURE__*/ function() {
      function MultipartParser(headers) {
          var _this = this;
          _class_call_check(this, MultipartParser);
          _define_property(this, "type", void 0);
          _define_property(this, "headers", {});
          _define_property(this, "parts", []);
          _define_property(this, "_parsingState", {
              status: 1,
              boundaryEnd: null
          });
          _define_property(this, "boundary", null);
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
          this._parsingState.status = 1;
      }
      _create_class(MultipartParser, [
          {
              key: "done",
              value: function done() {
                  return !this._parsingState;
              }
          },
          {
              key: "parse",
              value: function parse(text) {
                  parseText(this, text);
                  return this;
              }
          },
          {
              key: "push",
              value: function push(line) {
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
              }
          },
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

  exports.BodyHeaders = BodyHeaders;
  exports.Parser = MultipartParser;
  exports.Part = MultipartPart;
  exports.Response = MultipartResponse;
  exports.ResponseParsed = ParsedResponse;

}));
//# sourceMappingURL=parser-multipart.js.map
