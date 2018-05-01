"use strict";
/// <reference path="./interfaces/IRelationDataBucket.ts" />
/// <reference path="../collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
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
        const model = najs_binding_1.make(this.modelMap[name], [record]);
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
}
RelationDataBucket.className = constants_1.NajsEloquent.Relation.RelationDataBucket;
exports.RelationDataBucket = RelationDataBucket;
najs_binding_1.register(RelationDataBucket);
