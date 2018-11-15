"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.ts" />
/// <reference path="../definitions/query-builders/IConvention.ts" />
/// <reference path="../definitions/query-builders/IQueryExecutor.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilderHandler.ts" />
/// <reference path="../definitions/query-grammars/IBasicQuery.ts" />
/// <reference path="../definitions/query-grammars/IQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../util/factory");
const functions_1 = require("../util/functions");
class QueryBuilderHandlerBase {
    constructor(model, executorFactory) {
        this.model = model;
        this.executorFactory = executorFactory;
        this.used = false;
        this.softDeleteState = 'should-add';
    }
    getQueryExecutor() {
        return this.executorFactory.makeQueryExecutor(this);
    }
    getModel() {
        return this.model;
    }
    getPrimaryKeyName() {
        return this.model.getPrimaryKeyName();
    }
    setQueryName(name) {
        this.queryName = name;
    }
    getQueryName() {
        return this.queryName;
    }
    setLogGroup(group) {
        this.logGroup = group;
    }
    getLogGroup() {
        return this.logGroup;
    }
    markUsed() {
        this.used = true;
    }
    isUsed() {
        return this.used;
    }
    hasSoftDeletes() {
        return this.model
            .getDriver()
            .getSoftDeletesFeature()
            .hasSoftDeletes(this.model);
    }
    getSoftDeletesSetting() {
        return this.model
            .getDriver()
            .getSoftDeletesFeature()
            .getSoftDeletesSetting(this.model);
    }
    hasTimestamps() {
        return this.model
            .getDriver()
            .getTimestampsFeature()
            .hasTimestamps(this.model);
    }
    getTimestampsSetting() {
        return this.model
            .getDriver()
            .getTimestampsFeature()
            .getTimestampsSetting(this.model);
    }
    markSoftDeleteState(state) {
        this.softDeleteState = state;
    }
    getSoftDeleteState() {
        return this.softDeleteState;
    }
    shouldAddSoftDeleteCondition() {
        return this.softDeleteState === 'should-add' && this.hasSoftDeletes();
    }
    createCollection(result) {
        return factory_1.make_collection(result, item => this.createInstance(item));
    }
    setRelationDataBucket(relationDataBucket) {
        this.dataBucket = relationDataBucket;
    }
    getRelationDataBucket() {
        if (typeof this.dataBucket === 'undefined') {
            const relationFeature = this.model.getDriver().getRelationFeature();
            this.dataBucket = relationFeature.getDataBucket(this.model) || relationFeature.makeDataBucket(this.model);
        }
        return this.dataBucket;
    }
    createInstance(result) {
        const bucket = this.getRelationDataBucket();
        const model = bucket.makeModel(this.model, result);
        bucket.add(model);
        return model;
    }
    async loadEagerRelations(model) {
        if (typeof this.eagerRelations !== 'undefined') {
            await model.load(this.eagerRelations);
        }
    }
    setEagerRelations(relations) {
        if (typeof this.eagerRelations === 'undefined') {
            this.eagerRelations = functions_1.array_unique(relations);
        }
        this.eagerRelations = functions_1.array_unique([].concat(this.eagerRelations, relations));
    }
    getEagerRelations() {
        return this.eagerRelations;
    }
}
exports.QueryBuilderHandlerBase = QueryBuilderHandlerBase;
