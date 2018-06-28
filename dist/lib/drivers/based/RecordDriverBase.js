"use strict";
/// <reference types="najs-event" />
Object.defineProperty(exports, "__esModule", { value: true });
const Record_1 = require("../../model/Record");
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
    initialize(model, isGuarded, data) {
        if (data instanceof Record_1.Record) {
            this.attributes = data;
            return;
        }
        if (typeof data === 'object') {
            if (isGuarded) {
                this.attributes = new Record_1.Record();
                model.fill(data);
            }
            else {
                this.attributes = new Record_1.Record(data);
            }
        }
        else {
            this.attributes = new Record_1.Record();
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
