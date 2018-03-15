"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get_attribute(target, key) {
    if (typeof key !== 'symbol' && target['__knownAttributeList'].indexOf(key) === -1) {
        if (typeof target['accessors'][key] === 'object') {
            return target['accessors'][key]['type'] === 'getter'
                ? target[key]
                : target[target['accessors'][key]['ref']].call(target);
        }
        return target['getAttribute'].call(target, key);
    }
    return target[key];
}
function set_attribute(target, key, value) {
    if (typeof key !== 'symbol' && target['__knownAttributeList'].indexOf(key) === -1) {
        if (typeof target['mutators'][key] === 'object') {
            if (target['mutators'][key]['type'] === 'setter') {
                target[key] = value;
                return true;
            }
            target[target['mutators'][key]['ref']].call(target, value);
            return true;
        }
        return target['setAttribute'].call(target, key, value);
    }
    target[key] = value;
    return true;
}
function attributes_proxy() {
    return {
        get: get_attribute,
        set: set_attribute
    };
}
exports.attributes_proxy = attributes_proxy;
