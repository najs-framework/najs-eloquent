"use strict";
/// <reference types="najs-event" />
Object.defineProperty(exports, "__esModule", { value: true });
const DriverBase_1 = require("./DriverBase");
class RecordBaseDriver extends DriverBase_1.DriverBase {
    constructor(model) {
        super();
        this.modelName = model.getModelName();
        this.queryLogGroup = 'all';
        if (model.hasSoftDeletes()) {
            this.softDeletesSetting = model.getSoftDeletesSetting();
        }
        if (model.hasTimestamps()) {
            this.timestampsSetting = model.getTimestampsSetting();
        }
    }
    shouldBeProxied(key) {
        return key !== 'options';
    }
    hasAttribute(name) {
        return true;
    }
    getAttribute(name) {
        return this.attributes.getAttribute(name);
    }
    setAttribute(name, value) {
        return this.attributes.setAttribute(name, value);
    }
    toObject() {
        return this.attributes.toObject();
    }
    markModified(name) {
        this.attributes.markModified(name);
    }
    isModified(name) {
        return this.attributes.getModified().indexOf(name) !== -1;
    }
    getModified() {
        return this.attributes.getModified();
    }
}
exports.RecordBaseDriver = RecordBaseDriver;
