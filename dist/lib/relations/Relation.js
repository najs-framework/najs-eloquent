"use strict";
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../model/interfaces/IModelQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
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
    getModelByName(model) {
        return najs_binding_1.make(model);
    }
}
exports.Relation = Relation;
