"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../model/Model");
const collect_js_1 = require("collect.js");
const bson_1 = require("bson");
const collection = collect_js_1.default([]);
const Collection = Object.getPrototypeOf(collection).constructor;
function isModel(value) {
    return value instanceof Model_1.Model || (!!value && value._isNajsEloquentModel === true);
}
exports.isModel = isModel;
function isObjectId(value) {
    if (value instanceof bson_1.ObjectId) {
        return true;
    }
    if (!value || typeof value !== 'object') {
        return false;
    }
    return typeof value.toHexString === 'function' || value._bsontype === 'ObjectId' || value._bsontype === 'ObjectID';
}
exports.isObjectId = isObjectId;
function isCollection(value) {
    return value instanceof Collection;
}
exports.isCollection = isCollection;
function distinctModelByClassInCollection(collection) {
    const result = [];
    if (!isCollection(collection) || collection.isEmpty()) {
        return result;
    }
    const collected = {};
    for (let i = 0, l = collection.count(); i < l; i++) {
        const model = collection.get(i);
        if (collected[model.getModelName()] === true) {
            continue;
        }
        collected[model.getModelName()] = true;
        result.push(model);
    }
    return result;
}
exports.distinctModelByClassInCollection = distinctModelByClassInCollection;
