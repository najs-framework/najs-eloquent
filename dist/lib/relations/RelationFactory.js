"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="interfaces/IRelationFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("./HasOneOrMany");
const constants_1 = require("../constants");
const RelationType_1 = require("./RelationType");
const najs_binding_1 = require("najs-binding");
class RelationFactory {
    constructor(rootModel, name, isSample) {
        this.rootModel = rootModel;
        this.name = name;
        this.isSample = isSample;
    }
    hasOne(model, foreignKey, localKey) {
        return this.hasOneOrMany(true, model, foreignKey, localKey);
    }
    hasMany(model, foreignKey, localKey) {
        return this.hasOneOrMany(false, model, foreignKey, localKey);
    }
    hasOneOrMany(is1v1, model, foreignKey, localKey) {
        return this.setupRelation(constants_1.NajsEloquent.Relation.HasOneOrMany, () => {
            const foreign = this.getModelByNameOrDefinition(model);
            const localInfo = {
                model: this.rootModel.getModelName(),
                table: this.rootModel.getRecordName(),
                key: localKey || this.rootModel.getPrimaryKeyName()
            };
            const foreignInfo = {
                model: foreign.getModelName(),
                table: foreign.getRecordName(),
                key: foreignKey || foreign.getDriver().formatAttributeName(`${this.rootModel.getModelName()}Id`)
            };
            return this.setupHasOneOrMany(is1v1, localInfo, foreignInfo, is1v1 ? RelationType_1.RelationType.HasOne : RelationType_1.RelationType.HasMany);
        });
    }
    belongsTo(model, foreignKey, localKey) {
        return this.setupRelation(constants_1.NajsEloquent.Relation.HasOneOrMany, () => {
            const local = this.getModelByNameOrDefinition(model);
            const localInfo = {
                model: local.getModelName(),
                table: local.getRecordName(),
                key: localKey || local.getPrimaryKeyName()
            };
            const foreignInfo = {
                model: this.rootModel.getModelName(),
                table: this.rootModel.getRecordName(),
                key: foreignKey || this.rootModel.getDriver().formatAttributeName(`${local.getModelName()}Id`)
            };
            return this.setupHasOneOrMany(true, localInfo, foreignInfo, RelationType_1.RelationType.BelongsTo);
        });
    }
    setupHasOneOrMany(oneToOne, local, foreign, type) {
        const relation = najs_binding_1.make(constants_1.NajsEloquent.Relation.HasOneOrMany, [this.rootModel, this.name, type]);
        relation.setup(oneToOne, local, foreign);
        return relation;
    }
    setupRelation(className, setup) {
        if (this.isSample) {
            return najs_binding_1.make(className, [this.rootModel, this.name]);
        }
        if (!this.relation) {
            this.relation = setup();
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
