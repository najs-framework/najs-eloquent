"use strict";
/// <reference path="../../../definitions/data/IDataCollector.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../../definitions/query-builders/IConditionMatcher.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const DataConditionMatcher_1 = require("../../../data/DataConditionMatcher");
class MorphOneOrManyExecutor {
    constructor(executor, targetMorphTypeName, typeValue) {
        this.executor = executor;
        this.morphTypeValue = typeValue;
        this.targetMorphTypeName = targetMorphTypeName;
    }
    setCollector(collector, conditions, reader) {
        conditions.unshift(new DataConditionMatcher_1.DataConditionMatcher(this.targetMorphTypeName, '=', this.morphTypeValue, reader));
        this.executor.setCollector(collector, conditions, reader);
        return this;
    }
    setQuery(query) {
        query.where(this.targetMorphTypeName, this.morphTypeValue);
        this.executor.setQuery(query);
        return this;
    }
    executeCollector() {
        return this.executor.executeCollector();
    }
    getEmptyValue() {
        return this.executor.getEmptyValue();
    }
    executeQuery() {
        return this.executor.executeQuery();
    }
}
exports.MorphOneOrManyExecutor = MorphOneOrManyExecutor;
