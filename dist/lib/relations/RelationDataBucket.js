"use strict";
/// <reference path="./interfaces/IRelationDataBucket.ts" />
/// <reference path="../collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const lodash_1 = require("lodash");
const bson_1 = require("bson");
const collect = require('collect.js');
class RelationDataBucket {
    constructor() {
        this.modelMap = {};
        this.bucket = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Relation.RelationDataBucket;
    }
    register(name, modelName) {
        this.modelMap[name] = modelName;
        return this;
    }
    newInstance(name, record) {
        if (!this.modelMap[name]) {
            throw new ReferenceError(`"${name}" is not found or not registered yet.`);
        }
        const model = this.makeModelFromRecord(name, record);
        if (typeof this.bucket[name] === 'undefined') {
            this.bucket[name] = {};
        }
        this.bucket[name][model.getPrimaryKey()] = record;
        model['relationDataBucket'] = this;
        return model;
    }
    newCollection(name, records) {
        return collect(records.map(item => this.newInstance(name, item)));
    }
    makeModelFromRecord(name, record) {
        return najs_binding_1.make(this.modelMap[name], [record]);
    }
    makeCollectionFromRecords(name, records) {
        return collect(records.map(item => this.makeModelFromRecord(name, item)));
    }
    getAttributes(name, attribute, allowDuplicated = false) {
        if (typeof this.bucket[name] === 'undefined') {
            return [];
        }
        const result = [];
        for (const key in this.bucket[name]) {
            const value = this.bucket[name][key][attribute];
            if (typeof value === 'undefined' || value === null) {
                continue;
            }
            result.push(value);
        }
        return allowDuplicated ? result : Array.from(new Set(result));
    }
    filter(name, key, value, getFirstOnly = false) {
        if (typeof this.bucket[name] === 'undefined') {
            return [];
        }
        const result = [];
        const convertedValue = this.convertToStringIfValueIsObjectID(value);
        for (const id in this.bucket[name]) {
            const compareValue = this.convertToStringIfValueIsObjectID(this.bucket[name][id][key]);
            if (lodash_1.eq(compareValue, convertedValue)) {
                result.push(this.bucket[name][id]);
                if (getFirstOnly) {
                    break;
                }
            }
        }
        return result;
    }
    convertToStringIfValueIsObjectID(value) {
        if (value instanceof bson_1.ObjectID) {
            return value.toHexString();
        }
        return value;
    }
}
RelationDataBucket.className = constants_1.NajsEloquent.Relation.RelationDataBucket;
exports.RelationDataBucket = RelationDataBucket;
najs_binding_1.register(RelationDataBucket);
