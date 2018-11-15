"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IBelongsToRelationship.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HasOneOrMany_1 = require("./HasOneOrMany");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
const accessors_1 = require("../../util/accessors");
const HasOneExecutor_1 = require("./executors/HasOneExecutor");
class BelongsTo extends HasOneOrMany_1.HasOneOrMany {
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.BelongsTo;
    }
    getType() {
        return RelationshipType_1.RelationshipType.BelongsTo;
    }
    getExecutor() {
        if (!this.executor) {
            this.executor = new HasOneExecutor_1.HasOneExecutor(this.getDataBucket(), this.targetModel);
        }
        return this.executor;
    }
    dissociate() {
        this.rootModel.setAttribute(this.rootKeyName, accessors_1.relationFeatureOf(this.rootModel).getEmptyValueForRelationshipForeignKey(this.rootModel, this.rootKeyName));
    }
}
BelongsTo.className = constants_1.NajsEloquent.Relation.Relationship.BelongsTo;
exports.BelongsTo = BelongsTo;
najs_binding_1.register(BelongsTo, constants_1.NajsEloquent.Relation.Relationship.BelongsTo);
