"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RelationUtilities_1 = require("./../RelationUtilities");
const najs_binding_1 = require("najs-binding");
const HasOneOrMany_1 = require("./HasOneOrMany");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
const HasManyExecutor_1 = require("./executors/HasManyExecutor");
const accessors_1 = require("../../util/accessors");
class HasMany extends HasOneOrMany_1.HasOneOrMany {
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.HasMany;
    }
    getType() {
        return RelationshipType_1.RelationshipType.HasMany;
    }
    getExecutor() {
        if (!this.executor) {
            this.executor = new HasManyExecutor_1.HasManyExecutor(this.getDataBucket(), this.targetModel);
        }
        return this.executor;
    }
    associate(...models) {
        RelationUtilities_1.RelationUtilities.associateMany(models, this.rootModel, this.rootKeyName, target => {
            target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName));
        });
        return this;
    }
    dissociate(...models) {
        RelationUtilities_1.RelationUtilities.dissociateMany(models, this.rootModel, this.rootKeyName, target => {
            target.setAttribute(this.targetKeyName, accessors_1.relationFeatureOf(target).getEmptyValueForRelationshipForeignKey(target, this.targetKeyName));
        });
        return this;
    }
}
HasMany.className = constants_1.NajsEloquent.Relation.Relationship.HasMany;
exports.HasMany = HasMany;
najs_binding_1.register(HasMany, constants_1.NajsEloquent.Relation.Relationship.HasMany);
