"use strict";
/// <reference types="najs-event" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const pluralize_1 = require("pluralize");
const najs_event_1 = require("najs-event");
class RecordBaseDriver {
    constructor(model) {
        this.modelName = model.getModelName();
        this.queryLogGroup = 'all';
        if (model.hasSoftDeletes()) {
            this.softDeletesSetting = model.getSoftDeletesSetting();
        }
        if (model.hasTimestamps()) {
            this.timestampsSetting = model.getTimestampsSetting();
        }
    }
    getRecord() {
        return this.attributes;
    }
    setRecord(value) {
        this.attributes = value;
    }
    useEloquentProxy() {
        return true;
    }
    shouldBeProxied(key) {
        return key !== 'options';
    }
    proxify(type, target, key, value) {
        if (type === 'get') {
            return this.getAttribute(key);
        }
        return this.setAttribute(key, value);
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
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
    }
    formatRecordName() {
        return pluralize_1.plural(lodash_1.snakeCase(this.modelName));
    }
    isSoftDeleted() {
        if (this.softDeletesSetting) {
            return this.attributes.getAttribute(this.softDeletesSetting.deletedAt) !== null;
        }
        return false;
    }
    getEventEmitter(global) {
        if (global) {
            return RecordBaseDriver.GlobalEventEmitter;
        }
        if (!this.eventEmitter) {
            this.eventEmitter = najs_event_1.EventEmitterFactory.create(true);
        }
        return this.eventEmitter;
    }
}
RecordBaseDriver.GlobalEventEmitter = najs_event_1.EventEmitterFactory.create(true);
exports.RecordBaseDriver = RecordBaseDriver;
