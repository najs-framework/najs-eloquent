"use strict";
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../model/interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class Relation {
    constructor(rootModel, name) {
        this.rootModel = rootModel;
        this.name = name;
    }
    getRelationInfo() {
        return this.rootModel['relations'][this.name];
    }
    getAttachedPropertyName() {
        return this.name;
    }
    isLoaded() {
        return !!this.getRelationInfo().isLoaded;
    }
    getData() {
        if (!this.isLoaded()) {
            return undefined;
        }
        return this.buildData();
    }
    getDataBucket() {
        return this.rootModel['relationDataBucket'];
    }
}
exports.Relation = Relation;
