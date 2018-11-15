"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const QueryBuilder_1 = require("../../../lib/query-builders/QueryBuilder");
const MemoryQueryBuilder_1 = require("../../../lib/drivers/memory/MemoryQueryBuilder");
const MemoryQueryBuilderHandler_1 = require("../../../lib/drivers/memory/MemoryQueryBuilderHandler");
const MemoryDataSource_1 = require("../../../lib/drivers/memory/MemoryDataSource");
const MemoryDataSourceProviderFacade_1 = require("../../../lib/facades/global/MemoryDataSourceProviderFacade");
MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.register(MemoryDataSource_1.MemoryDataSource, 'memory', true);
describe('MemoryQueryBuilder', function () {
    it('extends QueryBuilder', function () {
        const model = {};
        const instance = new MemoryQueryBuilder_1.MemoryQueryBuilder(new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model));
        expect(instance).toBeInstanceOf(QueryBuilder_1.QueryBuilder);
    });
});
