"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IHasOneRelationship.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HasOneOrMany_1 = require("./HasOneOrMany");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
const RelationUtilities_1 = require("../RelationUtilities");
const HasOneExecutor_1 = require("./executors/HasOneExecutor");
class HasOne extends HasOneOrMany_1.HasOneOrMany {
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.HasOne;
    }
    getType() {
        return RelationshipType_1.RelationshipType.HasOne;
    }
    getExecutor() {
        if (!this.executor) {
            this.executor = new HasOneExecutor_1.HasOneExecutor(this.getDataBucket(), this.targetModel);
        }
        return this.executor;
    }
    associate(model) {
        RelationUtilities_1.RelationUtilities.associateOne(model, this.rootModel, this.rootKeyName, target => {
            target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName));
        });
    }
}
HasOne.className = constants_1.NajsEloquent.Relation.Relationship.HasOne;
exports.HasOne = HasOne;
najs_binding_1.register(HasOne, constants_1.NajsEloquent.Relation.Relationship.HasOne);
