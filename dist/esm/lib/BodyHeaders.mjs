// @ts-ignore
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
let BodyHeaders = class BodyHeaders {
    constructor(){
        _define_property(this, "version", void 0);
        _define_property(this, "headers", {});
        _define_property(this, "ok", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "statusText", void 0);
    }
};
export { BodyHeaders as default };
