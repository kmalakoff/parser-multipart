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
        for(var key in this.headers)fn(this.headers[key]);
    }
    getSetCookie() {
        throw new Error('Unsupported: getSetCookie');
    }
    constructor(headers){
        this.headers = headers;
    }
};
export default typeof Headers === 'undefined' ? HeadersPolyfill : Headers;
