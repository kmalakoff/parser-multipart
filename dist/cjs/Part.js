"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ParseStatus = void 0;

var _parseHeader = _interopRequireDefault(require("./lib/parseHeader.js"));

var _parseText = _interopRequireDefault(require("./lib/parseText.js"));

var _Response = _interopRequireDefault(require("./Response.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ParseStatus;
exports.ParseStatus = ParseStatus;

(function (ParseStatus) {
  ParseStatus[ParseStatus["Headers"] = 1] = "Headers";
  ParseStatus[ParseStatus["Response"] = 2] = "Response";
})(ParseStatus || (exports.ParseStatus = ParseStatus = {}));

var MultipartPart = /*#__PURE__*/function () {
  function MultipartPart() {
    _classCallCheck(this, MultipartPart);

    _defineProperty(this, "headers", {});

    _defineProperty(this, "response", void 0);

    _defineProperty(this, "_parsingState", {
      status: ParseStatus.Headers
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
      (0, _parseText["default"])(this, text);
    }
  }, {
    key: "push",
    value: function push(line) {
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
          this.response = new _Response["default"](this.headers["content-type"]);
        } else (0, _parseHeader["default"])(this.headers, line, ":");
      } else if (this._parsingState.status === ParseStatus.Response) {
        this.response.push(line);
      }
    }
  }]);

  return MultipartPart;
}();

exports["default"] = MultipartPart;
//# sourceMappingURL=Part.js.map