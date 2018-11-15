"use strict";
/// <reference path="../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../definitions/collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const accessors_1 = require("../util/accessors");
const DataBuffer_1 = require("../data/DataBuffer");
const factory_1 = require("../util/factory");
class RelationDataBucket {
    constructor() {
        this.bucket = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Relation.RelationDataBucket;
    }
    add(model) {
        this.getDataOf(model).add(accessors_1.relationFeatureOf(model).getRawDataForDataBucket(model));
        return this;
    }
    makeModel(model, data) {
        const instance = najs_binding_1.make(najs_binding_1.getClassName(model), [data, false]);
        accessors_1.relationFeatureOf(instance).setDataBucket(instance, this);
        return instance;
    }
    makeCollection(model, data) {
        return factory_1.make_collection(data, item => this.makeModel(model, item));
    }
    getDataOf(model) {
        return this.bucket[this.createKey(model)].data;
    }
    getMetadataOf(model) {
        return this.bucket[this.createKey(model)].meta;
    }
    createKey(model) {
        const key = accessors_1.relationFeatureOf(model).createKeyForDataBucket(model);
        if (typeof this.bucket[key] === 'undefined') {
            this.bucket[key] = {
                data: new DataBuffer_1.DataBuffer(model.getPrimaryKeyName(), accessors_1.relationFeatureOf(model).getDataReaderForDataBucket()),
                meta: {
                    loaded: []
                }
            };
        }
        return key;
    }
}
exports.RelationDataBucket = RelationDataBucket;
najs_binding_1.register(RelationDataBucket, constants_1.NajsEloquent.Relation.RelationDataBucket);
