"use strict";
/// <reference types="najs-event" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_event_1 = require("najs-event");
const lodash_1 = require("lodash");
const pluralize_1 = require("pluralize");
class DriverBase {
    getRecord() {
        return this.attributes;
    }
    setRecord(value) {
        this.attributes = value;
    }
    proxify(type, target, key, value) {
        if (type === 'get') {
            return this.getAttribute(key);
        }
        return this.setAttribute(key, value);
    }
    useEloquentProxy() {
        return true;
    }
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
    }
    formatRecordName() {
        return pluralize_1.plural(lodash_1.snakeCase(this.modelName));
    }
    isSoftDeleted() {
        if (this.softDeletesSetting) {
            return this.getAttribute(this.softDeletesSetting.deletedAt) !== null;
        }
        return false;
    }
    getModelComponentName() {
        return undefined;
    }
    getModelComponentOrder(components) {
        return components;
    }
    getEventEmitter(global) {
        if (global) {
            return DriverBase.GlobalEventEmitter;
        }
        if (!this.eventEmitter) {
            this.eventEmitter = najs_event_1.EventEmitterFactory.create(true);
        }
        return this.eventEmitter;
    }
}
DriverBase.GlobalEventEmitter = najs_event_1.EventEmitterFactory.create(true);
exports.DriverBase = DriverBase;
