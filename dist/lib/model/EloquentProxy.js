"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EloquentProxy = {
    shouldProxy(target, key) {
        return (typeof key !== 'symbol' &&
            target.knownAttributes.indexOf(key) === -1 &&
            (typeof target.relationsMap === 'undefined' || typeof target.relationsMap[key] === 'undefined') &&
            target.driver.shouldBeProxied(key));
    },
    get(target, key) {
        if (this.shouldProxy(target, key)) {
            return target.driver.proxify('get', target, key);
        }
        return target[key];
    },
    set(target, key, value) {
        if (this.shouldProxy(target, key)) {
            return target.driver.proxify('set', target, key, value);
        }
        target[key] = value;
        return true;
    }
};
