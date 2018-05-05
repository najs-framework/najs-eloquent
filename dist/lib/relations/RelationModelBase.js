"use strict";
/// <reference path="./interfaces/IRelation.ts" />
/// <reference path="./interfaces/IRelationDataBucket.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../model/Model");
class RelationModelBase extends Model_1.Model {
    constructor() {
        super(...arguments);
        this.isRelationLoaded = false;
    }
    getRelationName() {
        return this.relationName;
    }
    getRelation() {
        return {};
    }
    isLoaded() {
        return this.isRelationLoaded;
    }
    async lazyLoad(model) { }
    async eagerLoad(model) { }
    getDataBucket() {
        return {};
        // return this.relationDataBucket
    }
    setDataBucket(bucket) {
        // this.relationDataBucket = bucket
        return this;
    }
}
exports.RelationModelBase = RelationModelBase;
