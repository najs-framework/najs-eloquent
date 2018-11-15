"use strict";
/// <reference path="../../definitions/collect.js/index.d.ts" />
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IMorphManyRelationship.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HasOneOrMany_1 = require("./HasOneOrMany");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
const HasManyExecutor_1 = require("./executors/HasManyExecutor");
const MorphOneOrManyExecutor_1 = require("./executors/MorphOneOrManyExecutor");
const RelationUtilities_1 = require("../RelationUtilities");
const accessors_1 = require("../../util/accessors");
class MorphMany extends HasOneOrMany_1.HasOneOrMany {
    constructor(root, relationName, target, targetType, targetKey, rootKey) {
        super(root, relationName, target, targetKey, rootKey);
        this.targetMorphTypeName = targetType;
    }
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.MorphMany;
    }
    getType() {
        return RelationshipType_1.RelationshipType.MorphMany;
    }
    getExecutor() {
        if (!this.executor) {
            this.executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(new HasManyExecutor_1.HasManyExecutor(this.getDataBucket(), this.targetModel), this.targetMorphTypeName, HasOneOrMany_1.HasOneOrMany.findMorphType(this.rootModel));
        }
        return this.executor;
    }
    associate(...models) {
        RelationUtilities_1.RelationUtilities.associateMany(models, this.rootModel, this.rootKeyName, target => {
            target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName));
            target.setAttribute(this.targetMorphTypeName, MorphMany.findMorphType(this.rootModel.getModelName()));
        });
        return this;
    }
    dissociate(...models) {
        RelationUtilities_1.RelationUtilities.dissociateMany(models, this.rootModel, this.rootKeyName, target => {
            const relationFeature = accessors_1.relationFeatureOf(target);
            target.setAttribute(this.targetKeyName, relationFeature.getEmptyValueForRelationshipForeignKey(target, this.targetKeyName));
            target.setAttribute(this.targetMorphTypeName, relationFeature.getEmptyValueForRelationshipForeignKey(target, this.targetMorphTypeName));
        });
        return this;
    }
}
MorphMany.className = constants_1.NajsEloquent.Relation.Relationship.MorphMany;
exports.MorphMany = MorphMany;
najs_binding_1.register(MorphMany, constants_1.NajsEloquent.Relation.Relationship.MorphMany);
