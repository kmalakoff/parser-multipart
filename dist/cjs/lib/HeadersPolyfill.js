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
var HeadersPolyfill = /*#__PURE__*/ function() {
    "use strict";
    function HeadersPolyfill(headers) {
        _class_call_check(this, HeadersPolyfill);
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
var _default = typeof Headers === 'undefined' ? HeadersPolyfill : Headers;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }