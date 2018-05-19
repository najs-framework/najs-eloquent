"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="interfaces/IRelationFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("./HasOneOrMany");
const constants_1 = require("../constants");
const najs_binding_1 = require("najs-binding");
class RelationFactory {
    constructor(rootModel, name, isSample) {
        this.rootModel = rootModel;
        this.name = name;
        this.isSample = isSample;
    }
    hasOne(model, foreignKey, localKey) {
        if (this.isSample) {
            return najs_binding_1.make(constants_1.NajsEloquent.Relation.HasOneOrMany, [this.rootModel, this.name]);
        }
        if (!this.relation) {
            const relation = najs_binding_1.make(constants_1.NajsEloquent.Relation.HasOneOrMany, [this.rootModel, this.name]);
            const foreign = this.getModelByNameOrDefinition(model);
            relation.setup(true, {
                model: this.rootModel.getModelName(),
                table: this.rootModel.getRecordName(),
                key: localKey || this.rootModel.getPrimaryKey()
            }, {
                model: foreign.getModelName(),
                table: foreign.getRecordName(),
                key: foreignKey || foreign.getDriver().formatAttributeName(`${this.rootModel.getModelName()}Id`)
            });
            this.relation = relation;
        }
        return this.relation;
    }
    getModelByNameOrDefinition(model) {
        if (typeof model === 'function') {
            return Reflect.construct(model, []);
        }
        return najs_binding_1.make(model);
    }
}
exports.RelationFactory = RelationFactory;
