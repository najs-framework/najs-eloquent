"use strict";
/// <reference path="../../../definitions/data/IDataCollector.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../../definitions/query-builders/IConditionMatcher.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class HasOneOrManyExecutor {
    constructor(dataBucket, targetModel) {
        this.dataBucket = dataBucket;
        this.targetModel = targetModel;
    }
    setCollector(collector, conditions, reader) {
        this.collector = collector;
        this.collector.filterBy({ $and: conditions });
        return this;
    }
    setQuery(query) {
        this.query = query;
        return this;
    }
}
exports.HasOneOrManyExecutor = HasOneOrManyExecutor;
