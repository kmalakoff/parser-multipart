"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
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
var HeadersPolyfill = /*#__PURE__*/ function() {
    "use strict";
    function HeadersPolyfill(headers) {
        _class_call_check(this, HeadersPolyfill);
        _define_property(this, "headers", void 0);
        this.headers = headers;
    }
    _create_class(HeadersPolyfill, [
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
var _default = typeof Headers === "undefined" ? HeadersPolyfill : Headers;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }