"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IRecordExecutor.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const najs_binding_1 = require("najs-binding");
const RecordManagerBase_1 = require("./RecordManagerBase");
const Record_1 = require("./Record");
const constants_1 = require("../constants");
class RecordManager extends RecordManagerBase_1.RecordManagerBase {
    getClassName() {
        return constants_1.NajsEloquent.Feature.RecordManager;
    }
    initialize(model, isGuarded, data) {
        if (data instanceof Record_1.Record) {
            model.attributes = data;
            return;
        }
        if (typeof data !== 'object') {
            model.attributes = new Record_1.Record();
            return;
        }
        if (!isGuarded) {
            model.attributes = new Record_1.Record(data);
            return;
        }
        model.attributes = new Record_1.Record();
        model
            .getDriver()
            .getFillableFeature()
            .fill(model, data);
    }
    getAttribute(model, key) {
        return model.attributes.getAttribute(key);
    }
    setAttribute(model, key, value) {
        return model.attributes.setAttribute(key, value);
    }
    hasAttribute(model, key) {
        return true;
    }
    getPrimaryKeyName(model) {
        return model
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(model, 'primaryKey', 'id');
    }
    toObject(model) {
        return model.attributes.toObject();
    }
    markModified(model, keys) {
        const attributes = lodash_1.flatten(lodash_1.flatten(keys));
        for (const attribute of attributes) {
            model.attributes.markModified(attribute);
        }
    }
    isModified(model, keys) {
        const attributes = lodash_1.flatten(lodash_1.flatten(keys));
        const modified = model.attributes.getModified();
        for (const attribute of attributes) {
            if (modified.indexOf(attribute) === -1) {
                return false;
            }
        }
        return true;
    }
    getModified(model) {
        return model.attributes.getModified();
    }
    isNew(model) {
        return !this.getPrimaryKey(model);
    }
}
exports.RecordManager = RecordManager;
najs_binding_1.register(RecordManager, constants_1.NajsEloquent.Feature.RecordManager);
