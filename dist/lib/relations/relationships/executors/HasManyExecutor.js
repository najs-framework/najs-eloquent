"use strict";
/// <reference path="../../../definitions/data/IDataCollector.ts" />
/// <reference path="../../../definitions/model/IModel.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../../definitions/collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../../../util/factory");
const HasOneOrManyExecutor_1 = require("./HasOneOrManyExecutor");
class HasManyExecutor extends HasOneOrManyExecutor_1.HasOneOrManyExecutor {
    async executeQuery() {
        return this.query.get();
    }
    executeCollector() {
        return this.dataBucket.makeCollection(this.targetModel, this.collector.exec());
    }
    getEmptyValue() {
        return factory_1.make_collection([]);
    }
}
exports.HasManyExecutor = HasManyExecutor;
