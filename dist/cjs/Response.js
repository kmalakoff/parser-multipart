"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ParseStatus = exports.BodyHeaders = void 0;

var _parseHeader = _interopRequireDefault(require("./lib/parseHeader.js"));

var _parseStatus = _interopRequireDefault(require("./lib/parseStatus.js"));

var _parseText = _interopRequireDefault(require("./lib/parseText.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ParseStatus;
exports.ParseStatus = ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
  ParseStatus[ParseStatus["Body"] = 2] = "Body";
})(ParseStatus || (exports.ParseStatus = ParseStatus = {}));

var BodyHeaders = /*#__PURE__*/_createClass(function BodyHeaders() {
  _classCallCheck(this, BodyHeaders);

  _defineProperty(this, "version", void 0);

  _defineProperty(this, "headers", {});

  _defineProperty(this, "ok", void 0);

  _defineProperty(this, "status", void 0);

  _defineProperty(this, "statusText", void 0);
});

exports.BodyHeaders = BodyHeaders;

var MultipartResponse = /*#__PURE__*/function () {
  function MultipartResponse(contentType) {
    _classCallCheck(this, MultipartResponse);

    _defineProperty(this, "contentType", void 0);

    _defineProperty(this, "headers", null);

    _defineProperty(this, "body", null);

    _defineProperty(this, "_parsingState", {
      status: ParseStatus.Body,
      lines: []
    });

    if (contentType === undefined) throw new Error("Response missing a content type");
    this.contentType = contentType;

    if (this.contentType === "application/http") {
      this.headers = new BodyHeaders();
      this._parsingState.status = ParseStatus.Headers;
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
      (0, _parseText["default"])(this, text);
    }
  }, {
    key: "push",
    value: function push(line) {
      if (!this._parsingState) throw new Error("Attempting to parse a completed response");

      if (line === null) {
        if (this._parsingState.status !== ParseStatus.Body) throw new Error("Unexpected parsing state");
        this.body = this._parsingState.lines.join("\r\n");
        this._parsingState = null;
        return;
      }

      if (this._parsingState.status === ParseStatus.Headers) {
        if (!line.length) this._parsingState.status = ParseStatus.Body;else if (!(0, _parseStatus["default"])(this.headers, line)) (0, _parseHeader["default"])(this.headers.headers, line, ":");
      } else if (this._parsingState.status === ParseStatus.Body) {
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

exports["default"] = MultipartResponse;
//# sourceMappingURL=Response.js.map