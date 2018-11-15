"use strict";
/// <reference path="../../definitions/query-grammars/IConditionQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var BoolOperator;
(function (BoolOperator) {
    BoolOperator["AND"] = "and";
    BoolOperator["OR"] = "or";
})(BoolOperator = exports.BoolOperator || (exports.BoolOperator = {}));
class BasicQueryConverter {
    constructor(basicQuery, matcherFactory) {
        this.basicQuery = basicQuery;
        this.matcherFactory = matcherFactory;
    }
    getConvertedQuery() {
        return this.convertQueries(this.basicQuery.getConditions());
    }
    convertQueries(data) {
        const processedData = this.preprocessData(data);
        if (!processedData) {
            return {};
        }
        return {
            [`$${processedData.bool}`]: processedData.queries.map(item => this.convertQuery(item))
        };
    }
    convertQuery(data) {
        if (typeof data['queries'] === 'undefined') {
            return this.convertSingleQuery(data);
        }
        return this.convertGroupQuery(data);
    }
    convertSingleQuery(data) {
        return this.matcherFactory.transform(this.matcherFactory.make(data));
    }
    convertGroupQuery(data) {
        if (data.queries.length === 1) {
            return this.convertQuery(data.queries[0]);
        }
        return this.convertQueries(data.queries);
    }
    preprocessData(data) {
        if (data.length === 0) {
            return undefined;
        }
        if (data.length === 1) {
            return {
                bool: data[0].bool,
                queries: [data[0]]
            };
        }
        this.fixSyntaxEdgeCasesOfData(data);
        if (this.checkDataHasTheSameBooleanOperator(data)) {
            return {
                bool: data[0].bool,
                queries: data
            };
        }
        return this.groupAndBooleanQueries(data);
    }
    fixSyntaxEdgeCasesOfData(data) {
        // edge case: .orWhere().where()
        if (data[0].bool === BoolOperator.AND && data[1].bool === BoolOperator.OR) {
            data[0].bool = BoolOperator.OR;
        }
        // always group and operator, for example: a | b & c | d => a | (b & c) | d
        for (let i = 1, l = data.length; i < l; i++) {
            if (data[i].bool === BoolOperator.AND && data[i - 1].bool === BoolOperator.OR) {
                data[i - 1].bool = BoolOperator.AND;
            }
        }
    }
    checkDataHasTheSameBooleanOperator(queries) {
        let currentBool = queries[0].bool;
        for (let i = 1, l = queries.length; i < l; i++) {
            if (queries[i].bool !== currentBool) {
                return false;
            }
            currentBool = queries[i].bool;
        }
        return true;
    }
    groupAndBooleanQueries(queries) {
        const result = [];
        for (let i = 0, l = queries.length; i < l; i++) {
            if (queries[i].bool === BoolOperator.OR) {
                result.push(queries[i]);
                continue;
            }
            if (result.length === 0 || typeof result[result.length - 1]['queries'] === 'undefined') {
                result.push({ bool: BoolOperator.AND, queries: [queries[i]] });
                continue;
            }
            result[result.length - 1]['queries'].push(queries[i]);
        }
        return { bool: BoolOperator.OR, queries: result };
    }
}
exports.BasicQueryConverter = BasicQueryConverter;
