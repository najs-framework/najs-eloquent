"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="interfaces/IRelationFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Relation_1 = require("./Relation");
class RelationFactory {
    constructor(rootModel, name) {
        this.rootModel = rootModel;
        this.name = name;
        this.loaded = false;
    }
    hasOne(model, key, foreignKey) {
        return Reflect.construct(Relation_1.Relation, [this.rootModel, this.name]);
    }
}
exports.RelationFactory = RelationFactory;
