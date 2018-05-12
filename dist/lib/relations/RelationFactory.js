"use strict";
/// <reference path="interfaces/IRelationFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Relation_1 = require("./Relation");
class RelationFactory {
    hasOne(model, key, foreignKey) {
        return new Relation_1.Relation();
    }
}
exports.RelationFactory = RelationFactory;
