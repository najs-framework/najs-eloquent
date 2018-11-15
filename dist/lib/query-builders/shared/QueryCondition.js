"use strict";
/// <reference path="../../definitions/query-grammars/IBasicConditionQuery.ts" />
/// <reference path="../../definitions/query-grammars/IConditionQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ConditionQueryHandler_1 = require("./ConditionQueryHandler");
class QueryCondition {
    constructor() {
        this.isSubQuery = false;
        this.queries = [];
    }
    static create(convention, bool, arg0, arg1, arg2) {
        const condition = new QueryCondition();
        condition.convention = convention;
        condition.buildQuery(bool, arg0, arg1, arg2);
        return condition;
    }
    getConditionQueryHandler() {
        return new ConditionQueryHandler_1.ConditionQueryHandler(this, this.convention);
    }
    toObject() {
        const result = {
            bool: this.bool
        };
        if (this.queries.length > 0) {
            result['queries'] = [];
            for (const subQuery of this.queries) {
                result['queries'].push(subQuery.toObject());
            }
        }
        else {
            result['operator'] = this.operator;
            result['field'] = this.field;
            result['value'] = this.value;
        }
        return result;
    }
    buildQuery(bool, arg0, arg1, arg2) {
        let queryCondition;
        if (this.isSubQuery) {
            queryCondition = new QueryCondition();
            this.queries.push(queryCondition);
        }
        else {
            queryCondition = this;
        }
        queryCondition.bool = bool;
        if (lodash_1.isFunction(arg0)) {
            return this.buildSubQuery(queryCondition, arg0);
        }
        queryCondition.field = this.convention.formatFieldName(arg0);
        if (typeof arg2 === 'undefined') {
            // case 2
            queryCondition.operator = '=';
            queryCondition.value = arg1;
        }
        else {
            // case 3
            queryCondition.operator = arg1;
            queryCondition.value = arg2;
        }
        return this;
    }
    buildSubQuery(queryCondition, arg0) {
        // case 1
        const query = new QueryCondition();
        query.convention = this.convention;
        query.isSubQuery = true;
        arg0.call(undefined, query.getConditionQueryHandler());
        for (const instance of query.queries) {
            queryCondition.queries.push(instance);
        }
        query.isSubQuery = false;
        return this;
    }
    where(arg0, arg1, arg2) {
        return this.buildQuery('and', arg0, arg1, arg2);
    }
    orWhere(arg0, arg1, arg2) {
        return this.buildQuery('or', arg0, arg1, arg2);
    }
}
exports.QueryCondition = QueryCondition;
