// @ts-ignore
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return ParsedResponse;
    }
});
var _HeadersPolyfillts = /*#__PURE__*/ _interop_require_default(require("./lib/HeadersPolyfill.js"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ParsedResponse = /*#__PURE__*/ function() {
    "use strict";
    function ParsedResponse(parser) {
        _class_call_check(this, ParsedResponse);
        _define_property(this, "_parser", void 0);
        _define_property(this, "_bodyUsed", void 0);
        this._parser = parser;
        this._bodyUsed = false;
    }
    _create_class(ParsedResponse, [
        {
            key: "type",
            get: function get() {
                return "default";
            }
        },
        {
            key: "headers",
            get: function get() {
                return new _HeadersPolyfillts.default(this._parser.headers.headers);
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

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}