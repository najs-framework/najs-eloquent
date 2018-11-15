"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Relationship_1 = require("../Relationship");
const RelationshipType_1 = require("../RelationshipType");
const DataConditionMatcher_1 = require("../../data/DataConditionMatcher");
const RelationUtilities_1 = require("../RelationUtilities");
class HasOneOrMany extends Relationship_1.Relationship {
    constructor(root, relationName, target, targetKey, rootKey) {
        super(root, relationName);
        this.rootKeyName = rootKey;
        this.targetDefinition = target;
        this.targetKeyName = targetKey;
    }
    collectData() {
        const dataBucket = this.getDataBucket();
        if (!dataBucket) {
            return undefined;
        }
        const dataBuffer = dataBucket.getDataOf(this.targetModel);
        const collector = dataBuffer.getCollector();
        const rootKey = this.rootModel.getAttribute(this.rootKeyName);
        const reader = dataBuffer.getDataReader();
        return this.getExecutor()
            .setCollector(collector, [new DataConditionMatcher_1.DataConditionMatcher(this.targetKeyName, '=', rootKey, reader)], reader)
            .executeCollector();
    }
    async fetchData(type) {
        const query = this.createTargetQuery(`${this.getType()}:${this.targetModel.getModelName()}`);
        if (type === 'lazy') {
            query.where(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName));
        }
        else {
            const dataBucket = this.getDataBucket();
            if (!dataBucket) {
                return this.getExecutor().getEmptyValue();
            }
            const ids = RelationUtilities_1.RelationUtilities.getAttributeListInDataBucket(dataBucket, this.rootModel, this.rootKeyName);
            query.whereIn(this.targetKeyName, ids);
        }
        return this.getExecutor()
            .setQuery(query)
            .executeQuery();
    }
    isInverseOf(relationship) {
        if (!(relationship instanceof HasOneOrMany)) {
            return false;
        }
        if (!this.isInverseOfTypeMatched(relationship)) {
            return false;
        }
        return (this.rootModel.getModelName() === relationship.targetModel.getModelName() &&
            this.rootKeyName === relationship.targetKeyName &&
            this.targetModel.getModelName() === relationship.rootModel.getModelName() &&
            this.targetKeyName === relationship.rootKeyName);
    }
    isInverseOfTypeMatched(relationship) {
        const thisType = this.getType();
        const comparedType = relationship.getType();
        if (thisType !== RelationshipType_1.RelationshipType.BelongsTo && comparedType !== RelationshipType_1.RelationshipType.BelongsTo) {
            return false;
        }
        if (thisType === RelationshipType_1.RelationshipType.BelongsTo) {
            return comparedType === RelationshipType_1.RelationshipType.HasMany || comparedType === RelationshipType_1.RelationshipType.HasOne;
        }
        return thisType === RelationshipType_1.RelationshipType.HasMany || thisType === RelationshipType_1.RelationshipType.HasOne;
    }
}
exports.HasOneOrMany = HasOneOrMany;
