"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true,
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return parseText;
  },
});
var _newlineIterator = /*#__PURE__*/ _interopRequireDefault(
  require("newline-iterator"),
);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj,
      };
}
function parseText(parser, text) {
  var iterator = (0, _newlineIterator.default)(text);
  var next = iterator.next();
  while (!next.done) {
    parser.push(next.value);
    next = iterator.next();
  }
  if (!parser.done()) parser.push(null);
}

if (
  (typeof exports.default === "function" ||
    (typeof exports.default === "object" && exports.default !== null)) &&
  typeof exports.default.__esModule === "undefined"
) {
  Object.defineProperty(exports.default, "__esModule", { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
