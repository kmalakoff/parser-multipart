"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ParseStatus = void 0;

var _Part = _interopRequireDefault(require("./Part.js"));

var _parseHeader = _interopRequireDefault(require("./lib/parseHeader.js"));

var _parseText = _interopRequireDefault(require("./lib/parseText.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ParseStatus;
exports.ParseStatus = ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Parts"] = 1] = "Parts";
})(ParseStatus || (exports.ParseStatus = ParseStatus = {}));

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
        (0, _parseHeader["default"])(this.headers, part, "=");
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
      (0, _parseText["default"])(this, text);
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
        this.parts.push(new _Part["default"]());
      } else if (part) part.push(line);else {
        if (line.length) throw new Error("Unexpected line: ".concat(line));
      }
    }
  }]);

  return MultipartParser;
}();

exports["default"] = MultipartParser;
//# sourceMappingURL=Parser.js.map