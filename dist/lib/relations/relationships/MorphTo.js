"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../definitions/relations/IMorphToRelationship.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Relationship_1 = require("../Relationship");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
const factory_1 = require("../../util/factory");
const functions_1 = require("../../util/functions");
const DataConditionMatcher_1 = require("../../data/DataConditionMatcher");
class MorphTo extends Relationship_1.Relationship {
    constructor(root, relationName, rootType, rootKey, targetKeyNameMap) {
        super(root, relationName);
        this.rootMorphTypeName = rootType;
        this.rootKeyName = rootKey;
        this.targetModelInstances = {};
        this.targetKeyNameMap = targetKeyNameMap;
    }
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.MorphTo;
    }
    getType() {
        return RelationshipType_1.RelationshipType.MorphTo;
    }
    makeTargetModel(modelName) {
        if (typeof this.targetModelInstances[modelName] === 'undefined') {
            this.targetModelInstances[modelName] = najs_binding_1.make(modelName);
        }
        return this.targetModelInstances[modelName];
    }
    createQueryForTarget(targetModel) {
        const name = `${this.getType()}:${targetModel.getModelName()}`;
        const queryBuilder = targetModel.newQuery(name);
        queryBuilder.handler.setRelationDataBucket(this.getDataBucket());
        return this.applyCustomQuery(queryBuilder);
    }
    findTargetKeyName(targetModel) {
        const modelName = targetModel.getModelName();
        if (typeof this.targetKeyNameMap[modelName] !== 'undefined') {
            return this.targetKeyNameMap[modelName];
        }
        const morphType = Relationship_1.Relationship.findMorphType(modelName);
        if (typeof this.targetKeyNameMap[morphType] !== 'undefined') {
            return this.targetKeyNameMap[morphType];
        }
        return targetModel.getPrimaryKeyName();
    }
    collectDataInBucket(dataBucket, targetModel) {
        const rootKey = this.rootModel.getAttribute(this.rootKeyName);
        const dataBuffer = dataBucket.getDataOf(targetModel);
        const collector = dataBuffer.getCollector();
        collector.filterBy({
            $and: [new DataConditionMatcher_1.DataConditionMatcher(this.findTargetKeyName(targetModel), '=', rootKey, dataBuffer.getDataReader())]
        });
        return collector.exec();
    }
    collectData() {
        const dataBucket = this.getDataBucket();
        if (!dataBucket) {
            return undefined;
        }
        const morphType = this.rootModel.getAttribute(this.rootMorphTypeName);
        const targetModel = this.makeTargetModel(Relationship_1.Relationship.findModelName(morphType));
        const result = this.collectDataInBucket(dataBucket, targetModel);
        if (result.length === 0) {
            return undefined;
        }
        return dataBucket.makeModel(targetModel, result[0]);
    }
    getEagerFetchInfo(dataBucket) {
        const dataBuffer = dataBucket.getDataOf(this.rootModel);
        const reader = dataBuffer.getDataReader();
        return dataBuffer.reduce((memo, item) => {
            const morphTypeValue = reader.getAttribute(item, this.rootMorphTypeName);
            const modelName = Relationship_1.Relationship.findModelName(morphTypeValue);
            if (typeof memo[modelName] === 'undefined') {
                memo[modelName] = [];
            }
            memo[modelName].push(reader.getAttribute(item, this.rootKeyName));
            return memo;
        }, {});
    }
    async eagerFetchData() {
        const dataBucket = this.getDataBucket();
        if (!dataBucket) {
            return factory_1.make_collection([]);
        }
        const fetchInfo = this.getEagerFetchInfo(dataBucket);
        return (await Promise.all(Object.keys(fetchInfo).map((modelName) => {
            const targetModel = this.makeTargetModel(modelName);
            const query = this.createQueryForTarget(targetModel);
            query.whereIn(this.findTargetKeyName(targetModel), functions_1.array_unique(fetchInfo[modelName]));
            return query.first();
        })));
    }
    async fetchData(type) {
        if (type === 'eager') {
            return this.eagerFetchData();
        }
        const modelName = Relationship_1.Relationship.findModelName(this.rootModel.getAttribute(this.rootMorphTypeName));
        const targetModel = this.makeTargetModel(modelName);
        const query = this.createQueryForTarget(targetModel);
        query.where(this.findTargetKeyName(targetModel), this.rootModel.getAttribute(this.rootKeyName));
        return query.first();
    }
    isInverseOf(relationship) {
        return false;
    }
}
MorphTo.className = constants_1.NajsEloquent.Relation.Relationship.MorphTo;
exports.MorphTo = MorphTo;
najs_binding_1.register(MorphTo, constants_1.NajsEloquent.Relation.Relationship.MorphTo);
