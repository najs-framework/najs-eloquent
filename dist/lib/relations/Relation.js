"use strict";
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../model/interfaces/IEloquent.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
class Relation {
    constructor(rootModel, name) {
        this.rootModel = rootModel;
        this.name = name;
    }
    get relationData() {
        return this.rootModel['relations'][this.name];
    }
    getAttachedPropertyName() {
        return this.name;
    }
    isLoaded() {
        return !!this.relationData.isLoaded;
    }
    isBuilt() {
        return !!this.relationData.isBuilt;
    }
    markLoad(loaded) {
        this.relationData.isLoaded = loaded;
        return this;
    }
    markBuild(built) {
        this.relationData.isBuilt = built;
        return this;
    }
    getDataBucket() {
        return this.rootModel['relationDataBucket'];
    }
    getModelByName(model) {
        return najs_binding_1.make(model);
    }
    getKeysInDataBucket(table, key) {
        const relationDataBucket = this.rootModel.getRelationDataBucket();
        if (!relationDataBucket) {
            return [];
        }
        return relationDataBucket.getAttributes(table, key);
    }
    makeModelOrCollectionFromRecords(relationDataBucket, table, makeCollection, records) {
        if (makeCollection) {
            return relationDataBucket.makeCollectionFromRecords(table, records);
        }
        if (records.length === 0) {
            return undefined;
        }
        return relationDataBucket.makeModelFromRecord(table, records[0]);
    }
    getData() {
        if (!this.isLoaded()) {
            return undefined;
        }
        if (this.isBuilt()) {
            return this.relationData.data;
        }
        return this.buildData();
    }
    async load() {
        if (this.isLoaded() && this.isBuilt()) {
            return this.relationData.data;
        }
        if (!this.rootModel.getRelationDataBucket()) {
            if (this.rootModel.isNew()) {
                throw new Error(`Can not load relation "${this.name}" in a new instance of "${this.rootModel.getModelName()}".`);
            }
            return this.lazyLoad();
        }
        return this.eagerLoad();
    }
}
exports.Relation = Relation;
