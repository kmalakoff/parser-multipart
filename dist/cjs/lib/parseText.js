"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseText;

var _newlineIterator = _interopRequireDefault(require("newline-iterator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function parseText(parser, text) {
  var iterator = (0, _newlineIterator["default"])(text);
  var next = iterator.next();

  while (!next.done) {
    parser.push(next.value);
    next = iterator.next();
  }

  if (!parser.done()) parser.push(null);
}

module.exports = exports.default;
//# sourceMappingURL=parseText.js.map