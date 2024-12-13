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
var _HeadersPolyfill = /*#__PURE__*/ _interop_require_default(require("./lib/HeadersPolyfill.js"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ParsedResponse = /*#__PURE__*/ function() {
    "use strict";
    function ParsedResponse(parser) {
        _class_call_check(this, ParsedResponse);
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
    _create_class(ParsedResponse, [
        {
            key: "type",
            get: function get() {
                return 'default';
            }
        },
        {
            key: "headers",
            get: function get() {
                return new _HeadersPolyfill.default(this._parser.headers.headers);
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
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }