"use strict";
/// <reference path="../../contracts/MemoryDataSource.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const najs_binding_1 = require("najs-binding");
const RecordConditionMatcherFactory_1 = require("../RecordConditionMatcherFactory");
const BasicQueryConverter_1 = require("../../query-builders/shared/BasicQueryConverter");
const ExecutorBase_1 = require("../ExecutorBase");
const ExecutorUtils_1 = require("../../query-builders/shared/ExecutorUtils");
const MomentProviderFacade_1 = require("../../facades/global/MomentProviderFacade");
class MemoryQueryExecutor extends ExecutorBase_1.ExecutorBase {
    constructor(queryHandler, dataSource, logger) {
        super();
        this.queryHandler = queryHandler;
        this.dataSource = dataSource;
        this.basicQuery = queryHandler.getBasicQuery();
        this.logger = logger.name(this.queryHandler.getQueryName());
    }
    async get() {
        const collector = this.makeCollector();
        const result = this.shouldExecute() ? await this.collectResult(collector) : [];
        return this.logger
            .raw('.exec()')
            .action('get')
            .end(result);
    }
    async first() {
        const collector = this.makeCollector().limit(1);
        const result = this.shouldExecute() ? await this.collectResult(collector) : undefined;
        this.logger
            .raw('.limit(1).exec()')
            .action('first')
            .end(result ? result[0] : undefined);
        return result && result.length > 0 ? result[0] : undefined;
    }
    async count() {
        if (this.basicQuery.getSelect()) {
            this.basicQuery.clearSelect();
        }
        if (!lodash_1.isEmpty(this.basicQuery.getOrdering())) {
            this.basicQuery.clearOrdering();
        }
        const collector = this.makeCollector();
        const result = this.shouldExecute() ? await this.collectResult(collector) : [];
        return this.logger
            .raw('.exec()')
            .action('count')
            .end(result.length);
    }
    async update(data) {
        const collector = this.makeCollector();
        const records = this.shouldExecute() ? await this.collectResult(collector) : [];
        if (this.queryHandler.hasTimestamps()) {
            data[this.queryHandler.getTimestampsSetting().updatedAt] = MomentProviderFacade_1.MomentProvider.make().toDate();
        }
        if (records.length === 0) {
            return this.logger
                .raw('.exec() >> empty, do nothing')
                .action('update')
                .end(true);
        }
        this.logger.raw('.exec() >> update records >> dataSource.write()').action('update');
        return await this.updateRecordsByData(records, data);
    }
    async delete() {
        const collector = this.makeCollector();
        if (!collector.hasFilterByConfig()) {
            return false;
        }
        const records = this.shouldExecute() ? await this.collectResult(collector) : [];
        if (records.length === 0) {
            return this.logger
                .raw('.exec() >> empty, do nothing')
                .action('delete')
                .end(true);
        }
        this.logger.raw('.exec() >> delete records >> dataSource.write()').action('delete');
        for (const record of records) {
            this.dataSource.remove(record);
        }
        return this.logger.end(await this.dataSource.write());
    }
    async restore() {
        if (!this.queryHandler.hasSoftDeletes()) {
            return false;
        }
        const collector = this.makeCollector();
        if (!collector.hasFilterByConfig()) {
            return false;
        }
        const records = this.shouldExecute() ? await this.collectResult(collector) : [];
        if (records.length === 0) {
            return this.logger
                .raw('.exec() >> empty, do nothing')
                .action('restore')
                .end(true);
        }
        const fieldName = this.queryHandler.getSoftDeletesSetting().deletedAt;
        const data = { [fieldName]: this.queryHandler.getQueryConvention().getNullValueFor(fieldName) };
        this.logger.raw('.exec() >> update records >> dataSource.write()').action('restore');
        return await this.updateRecordsByData(records, data);
    }
    async execute() {
        return this.get();
    }
    async updateRecordsByData(records, data) {
        let shouldWrite = false;
        for (const record of records) {
            const info = this.getUpdateRecordInfo(record, data);
            if (info.modified) {
                shouldWrite = true;
                this.dataSource.add(record);
            }
            this.logger.updateRecordInfo(info);
        }
        return this.logger.end(shouldWrite ? await this.dataSource.write() : true);
    }
    getUpdateRecordInfo(record, data) {
        const info = {
            origin: Object.assign({}, record.toObject()),
            modified: false,
            updated: record.toObject()
        };
        record.clearModified();
        for (const name in data) {
            record.setAttribute(name, data[name]);
        }
        info.modified = record.getModified().length > 0;
        return info;
    }
    async collectResult(collector) {
        await this.dataSource.read();
        return collector.exec();
    }
    makeCollector() {
        const collector = this.dataSource.getCollector();
        this.logger
            .dataSource(this.dataSource)
            .raw(`MemoryDataSourceProvider.create("${this.queryHandler.getModel().getModelName()}").getCollector()`);
        const limit = this.basicQuery.getLimit();
        if (limit) {
            collector.limit(limit);
            this.logger.queryBuilderData('limit', limit).raw('.limit(', limit, ')');
        }
        const ordering = Array.from(this.basicQuery.getOrdering().entries());
        if (ordering && ordering.length > 0) {
            collector.orderBy(ordering);
            this.logger.queryBuilderData('ordering', ordering).raw('.orderBy(', JSON.stringify(ordering), ')');
        }
        const selected = this.basicQuery.getSelect();
        if (!lodash_1.isEmpty(selected)) {
            collector.select(selected);
            this.logger.queryBuilderData('select', selected).raw('.select(', selected, ')');
        }
        const conditions = this.getFilterConditions();
        if (!lodash_1.isEmpty(conditions)) {
            collector.filterBy(conditions);
            this.logger.queryBuilderData('conditions', this.basicQuery.getRawConditions()).raw('.filterBy(', conditions, ')');
        }
        return collector;
    }
    getFilterConditions() {
        ExecutorUtils_1.ExecutorUtils.addSoftDeleteConditionIfNeeded(this.queryHandler);
        const converter = new BasicQueryConverter_1.BasicQueryConverter(this.basicQuery, najs_binding_1.make(RecordConditionMatcherFactory_1.RecordConditionMatcherFactory.className));
        return converter.getConvertedQuery();
    }
}
exports.MemoryQueryExecutor = MemoryQueryExecutor;
