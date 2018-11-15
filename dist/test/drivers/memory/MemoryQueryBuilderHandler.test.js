"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const QueryBuilderHandlerBase_1 = require("../../../lib/query-builders/QueryBuilderHandlerBase");
const MemoryQueryBuilderHandler_1 = require("../../../lib/drivers/memory/MemoryQueryBuilderHandler");
const BasicQuery_1 = require("../../../lib/query-builders/shared/BasicQuery");
const MemoryQueryExecutor_1 = require("../../../lib/drivers/memory/MemoryQueryExecutor");
const ConditionQueryHandler_1 = require("../../../lib/query-builders/shared/ConditionQueryHandler");
const DefaultConvention_1 = require("../../../lib/query-builders/shared/DefaultConvention");
const MemoryDataSourceProviderFacade_1 = require("../../../lib/facades/global/MemoryDataSourceProviderFacade");
const MemoryDataSource_1 = require("../../../lib/drivers/memory/MemoryDataSource");
MemoryDataSourceProviderFacade_1.MemoryDataSourceProviderFacade.register(MemoryDataSource_1.MemoryDataSource, 'memory', true);
describe('MemoryQueryBuilderHandler', function () {
    it('extends QueryBuilderHandlerBase', function () {
        const model = {};
        const instance = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
        expect(instance).toBeInstanceOf(QueryBuilderHandlerBase_1.QueryBuilderHandlerBase);
    });
    describe('constructor()', function () {
        it('makes 3 instances, 1. convention = DefaultConvention', function () {
            const model = {};
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            expect(handler.getQueryConvention()).toBeInstanceOf(DefaultConvention_1.DefaultConvention);
        });
        it('makes 3 instances, 2. basicQuery = BasicQuery', function () {
            const model = {};
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            expect(handler.getBasicQuery()).toBeInstanceOf(BasicQuery_1.BasicQuery);
        });
        it('makes 3 instances, 3. conditionQuery = ConditionQueryHandle which wrap "basicQuery"', function () {
            const model = {};
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            expect(handler.getConditionQuery()).toBeInstanceOf(ConditionQueryHandler_1.ConditionQueryHandler);
            expect(handler.getConditionQuery()['basicConditionQuery'] === handler.getBasicQuery()).toBe(true);
        });
    });
    describe('.getBasicQuery()', function () {
        it('simply returns "basicQuery" property', function () {
            const model = {};
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            expect(handler.getBasicQuery() === handler['basicQuery']).toBe(true);
        });
    });
    describe('.getConditionQuery()', function () {
        it('simply returns "conditionQuery" property', function () {
            const model = {};
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            expect(handler.getConditionQuery() === handler['conditionQuery']).toBe(true);
        });
    });
    describe('.getQueryConvention()', function () {
        it('simply returns "convention" property', function () {
            const model = {};
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            expect(handler.getQueryConvention() === handler['convention']).toBe(true);
        });
    });
    describe('.getQueryExecutor()', function () {
        it('creates and returns new instance of MemoryQueryExecutor', function () {
            const model = {
                getRecordName() {
                    return 'model';
                },
                getModelName() {
                    return 'model';
                },
                getPrimaryKeyName() {
                    return 'id';
                }
            };
            const handler = new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model);
            const executor1 = handler.getQueryExecutor();
            const executor2 = handler.getQueryExecutor();
            expect(executor1 === executor2).toBe(false);
            expect(executor1).toBeInstanceOf(MemoryQueryExecutor_1.MemoryQueryExecutor);
        });
    });
});
