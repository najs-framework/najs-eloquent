"use strict";
/// <reference path="../contracts/Driver.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const lodash_1 = require("lodash");
class DummyDriver {
    constructor() {
        this.attributes = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Driver.DummyDriver;
    }
    initialize(model, isGuarded, data) {
        this.attributes = data || {};
    }
    getRecordName() {
        return '';
    }
    getRecord() {
        return this.attributes;
    }
    setRecord(value) {
        this.attributes = value;
    }
    useEloquentProxy() {
        return false;
    }
    shouldBeProxied(key) {
        return false;
    }
    proxify(type, target, key, value) {
        if (type === 'get') {
            return target[key];
        }
        target[key] = value;
        return true;
    }
    hasAttribute(name) {
        return false;
    }
    getAttribute(name) {
        return this.attributes[name];
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
        return true;
    }
    getPrimaryKeyName() {
        return 'id';
    }
    toObject() {
        return this.attributes;
    }
    newQuery() {
        return {};
    }
    async delete(softDeletes) {
        return true;
    }
    async restore() {
        return true;
    }
    async save() {
        return true;
    }
    isNew() {
        return true;
    }
    isSoftDeleted() {
        return false;
    }
    markModified(name) { }
    getModelComponentName() {
        return undefined;
    }
    getModelComponentOrder(components) {
        return components;
    }
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
    }
}
DummyDriver.className = constants_1.NajsEloquent.Driver.DummyDriver;
exports.DummyDriver = DummyDriver;
najs_binding_1.register(DummyDriver);
