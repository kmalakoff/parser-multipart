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
  var HeadersPolyfill = /*#__PURE__*/ function() {
      function HeadersPolyfill(headers) {
          _class_call_check$5(this, HeadersPolyfill);
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
          throw new Error('Unsupported: getSetCookie');
      };
      return HeadersPolyfill;
  }();
  var HeadersPolyfill$1 = typeof Headers === 'undefined' ? HeadersPolyfill : Headers;

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
      return Constructor;
  }
  var ParsedResponse = /*#__PURE__*/ function() {
      function ParsedResponse(parser) {
          _class_call_check$4(this, ParsedResponse);
          this._parser = parser;
          this._bodyUsed = false;
      }
      var _proto = ParsedResponse.prototype;
      _proto.clone = function clone() {
          return new ParsedResponse(this._parser);
      };
      _proto.text = function text() {
          if (this._bodyUsed) return Promise.reject(new Error('Body already consumed'));
          this._bodyUsed = true;
          return Promise.resolve(this._parser.body);
      };
      _proto.json = function json() {
          if (this._bodyUsed) return Promise.reject(new Error('Body already consumed'));
          this._bodyUsed = true;
          return Promise.resolve(JSON.parse(this._parser.body));
      };
      _proto.arrayBuffer = function arrayBuffer() {
          return Promise.reject(new Error('Unsupported: arrayBuffer'));
      };
      _proto.blob = function blob() {
          return Promise.reject(new Error('Unsupported: blob'));
      };
      _proto.formData = function formData() {
          return Promise.reject(new Error('Unsupported: formData'));
      };
      _proto.bytes = function bytes() {
          return Promise.reject(new Error('Unsupported: bytes'));
      };
      _create_class$3(ParsedResponse, [
          {
              key: "type",
              get: function get() {
                  return 'default';
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
                  throw new Error('Not supported: body');
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
                  return '';
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

  function _class_call_check$3(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  var BodyHeaders = function BodyHeaders() {
      _class_call_check$3(this, BodyHeaders);
      this.headers = {};
  };

  function parseHeader(result, line, delimiter) {
      var index = line.indexOf(delimiter);
      if (index === -1) throw new Error("Unexpected header format: ".concat(line));
      var key = line.slice(0, index);
      var value = line.slice(index + 1);
      result[key.trim().toLowerCase()] = value.trim();
  }

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
      result.ok = result.statusText === 'OK';
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
      return Constructor;
  }
  var MultipartResponse = /*#__PURE__*/ function() {
      function MultipartResponse(contentType) {
          _class_call_check$2(this, MultipartResponse);
          this.headers = null;
          this.body = null;
          this._parsingState = {
              status: 2,
              lines: []
          };
          if (contentType === undefined) throw new Error('Response missing a content type');
          this.contentType = contentType;
          if (this.contentType === 'application/http') {
              this.headers = new BodyHeaders();
              this._parsingState.status = 1;
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
          if (!this._parsingState) throw new Error('Attempting to parse a completed response');
          if (line === null) {
              if (this._parsingState.status !== 2) throw new Error('Unexpected parsing state');
              this.body = this._parsingState.lines.join('\r\n');
              this._parsingState = null;
              return;
          }
          if (this._parsingState.status === 1) {
              if (!line.length) this._parsingState.status = 2;
              else if (!parseStatus(this.headers, line)) parseHeader(this.headers.headers, line, ':');
          } else if (this._parsingState.status === 2) {
              if (!line.length) this.push(null);
              else this._parsingState.lines.push(line);
          }
      };
      _create_class$2(MultipartResponse, [
          {
              key: "response",
              get: function get() {
                  if (this._parsingState) throw new Error('Attempting to use an incomplete response');
                  return new ParsedResponse(this);
              }
          }
      ]);
      return MultipartResponse;
  }();

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
      return Constructor;
  }
  var MultipartPart = /*#__PURE__*/ function() {
      function MultipartPart() {
          _class_call_check$1(this, MultipartPart);
          this.headers = {};
          this._parsingState = {
              status: 1
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
          if (!this._parsingState) throw new Error('Attempting to parse a completed part');
          if (line === null) {
              if (this._parsingState.status !== 2) throw new Error('Unexpected parsing state');
              if (!this._response.done()) this._response.push(null);
              this._parsingState = null;
              return;
          }
          if (this._parsingState.status === 1) {
              if (!line.length) {
                  if (this.headers['content-type'] === undefined) throw new Error('Missing content type');
                  this._parsingState.status = 2;
                  this._response = new MultipartResponse(this.headers['content-type']);
              } else parseHeader(this.headers, line, ':');
          } else if (this._parsingState.status === 2) {
              this._response.push(line);
          }
      };
      _create_class$1(MultipartPart, [
          {
              key: "response",
              get: function get() {
                  if (this._parsingState) throw new Error('Attempting to use an incomplete part');
                  return this._response.response;
              }
          }
      ]);
      return MultipartPart;
  }();

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
      return Constructor;
  }
  var MultipartParser = /*#__PURE__*/ function() {
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
              return parseHeader(_this.headers, part, '=');
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
          parseText(this, text);
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
              this.parts.push(new MultipartPart());
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

  exports.BodyHeaders = BodyHeaders;
  exports.Parser = MultipartParser;
  exports.Part = MultipartPart;
  exports.Response = MultipartResponse;
  exports.ResponseParsed = ParsedResponse;

}));
//# sourceMappingURL=parser-multipart.js.map
