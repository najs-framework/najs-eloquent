"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./mixin/Query");
const ConditionQuery_1 = require("./mixin/ConditionQuery");
const ExecuteQuery_1 = require("./mixin/ExecuteQuery");
const AdvancedQuery_1 = require("./mixin/AdvancedQuery");
const RelationQuery_1 = require("./mixin/RelationQuery");
class QueryBuilder {
    constructor(handler) {
        this.handler = handler;
    }
}
exports.QueryBuilder = QueryBuilder;
Object.assign(QueryBuilder.prototype, Query_1.Query, ConditionQuery_1.ConditionQuery, ExecuteQuery_1.ExecuteQuery, AdvancedQuery_1.AdvancedQuery, RelationQuery_1.RelationQuery);
