"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function attributes_proxy() {
    return {
        get(target, key) {
            if (typeof key !== 'symbol' && target['__knownAttributeList'].indexOf(key) === -1) {
                return target['getAttribute'].call(target, key);
            }
            return target[key];
        },
        set(target, key, value) {
            if (typeof key !== 'symbol' && target['__knownAttributeList'].indexOf(key) === -1) {
                return target['setAttribute'].call(target, key, value);
            }
            target[key] = value;
            return true;
        }
    };
}
exports.attributes_proxy = attributes_proxy;
//# sourceMappingURL=attributes_proxy.js.map