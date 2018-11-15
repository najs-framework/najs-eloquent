"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../definitions/relations/IMorphOneRelationship.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HasOneOrMany_1 = require("./HasOneOrMany");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
const HasOneExecutor_1 = require("./executors/HasOneExecutor");
const MorphOneOrManyExecutor_1 = require("./executors/MorphOneOrManyExecutor");
const RelationUtilities_1 = require("../RelationUtilities");
class MorphOne extends HasOneOrMany_1.HasOneOrMany {
    constructor(root, relationName, target, targetType, targetKey, rootKey) {
        super(root, relationName, target, targetKey, rootKey);
        this.targetMorphTypeName = targetType;
    }
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.MorphOne;
    }
    getType() {
        return RelationshipType_1.RelationshipType.MorphOne;
    }
    getExecutor() {
        if (!this.executor) {
            this.executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(new HasOneExecutor_1.HasOneExecutor(this.getDataBucket(), this.targetModel), this.targetMorphTypeName, HasOneOrMany_1.HasOneOrMany.findMorphType(this.rootModel));
        }
        return this.executor;
    }
    associate(model) {
        RelationUtilities_1.RelationUtilities.associateOne(model, this.rootModel, this.rootKeyName, target => {
            target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName));
            target.setAttribute(this.targetMorphTypeName, MorphOne.findMorphType(this.rootModel.getModelName()));
        });
    }
}
MorphOne.className = constants_1.NajsEloquent.Relation.Relationship.MorphOne;
exports.MorphOne = MorphOne;
najs_binding_1.register(MorphOne, constants_1.NajsEloquent.Relation.Relationship.MorphOne);
