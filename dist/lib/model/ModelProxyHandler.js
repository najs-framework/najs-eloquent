"use strict";
/// <reference path="../definitions/model/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelProxyHandler = {
    get(target, key) {
        if (target.driver.shouldBeProxied(target, key)) {
            return target.driver.proxify('get', target, key);
        }
        return target[key];
    },
    set(target, key, value) {
        if (target.driver.shouldBeProxied(target, key)) {
            return target.driver.proxify('set', target, key, value);
        }
        target[key] = value;
        return true;
    }
};
