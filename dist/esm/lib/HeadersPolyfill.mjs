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
let HeadersPolyfill = class HeadersPolyfill {
    get(key) {
        return this.headers[key];
    }
    set(key, value) {
        this.headers[key] = value;
    }
    append(key, value) {
        this.headers[key] = value;
    }
    delete(key) {
        delete this.headers[key];
    }
    has(key) {
        return this.headers[key] === undefined;
    }
    forEach(fn) {
        for(const key in this.headers)fn(this.headers[key]);
    }
    getSetCookie() {
        throw new Error('Unsupported: getSetCookie');
    }
    constructor(headers){
        _define_property(this, "headers", void 0);
        this.headers = headers;
    }
};
export default typeof Headers === 'undefined' ? HeadersPolyfill : Headers;
