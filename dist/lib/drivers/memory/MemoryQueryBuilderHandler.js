"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/query-grammars/IBasicQuery.ts" />
/// <reference path="../../definitions/query-grammars/IConditionQuery.ts" />
/// <reference path="../../definitions/query-builders/IConvention.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultConvention_1 = require("../../query-builders/shared/DefaultConvention");
const najs_binding_1 = require("najs-binding");
const QueryBuilderHandlerBase_1 = require("../../query-builders/QueryBuilderHandlerBase");
const BasicQuery_1 = require("../../query-builders/shared/BasicQuery");
const ConditionQueryHandler_1 = require("../../query-builders/shared/ConditionQueryHandler");
const MemoryExecutorFactory_1 = require("./MemoryExecutorFactory");
class MemoryQueryBuilderHandler extends QueryBuilderHandlerBase_1.QueryBuilderHandlerBase {
    constructor(model) {
        super(model, najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className));
        this.convention = new DefaultConvention_1.DefaultConvention();
        this.basicQuery = new BasicQuery_1.BasicQuery(this.convention);
        this.conditionQuery = new ConditionQueryHandler_1.ConditionQueryHandler(this.basicQuery, this.convention);
    }
    getBasicQuery() {
        return this.basicQuery;
    }
    getConditionQuery() {
        return this.conditionQuery;
    }
    getQueryConvention() {
        return this.convention;
    }
}
exports.MemoryQueryBuilderHandler = MemoryQueryBuilderHandler;
