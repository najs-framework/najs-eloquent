"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryCondition_1 = require("./QueryCondition");
const lodash_1 = require("lodash");
const functions_1 = require("../../util/functions");
const Operator_1 = require("./Operator");
class BasicQuery {
    constructor(convention) {
        this.fields = {};
        this.ordering = new Map();
        this.conditions = [];
        this.convention = convention;
    }
    getConditions() {
        return this.conditions.map(item => item.toObject());
    }
    getRawConditions() {
        return this.conditions;
    }
    getLimit() {
        return this.limitNumber;
    }
    getOrdering() {
        return this.ordering;
    }
    getSelect() {
        return this.fields.select;
    }
    clearSelect() {
        delete this.fields.select;
    }
    clearOrdering() {
        this.ordering.clear();
    }
    select(...fields) {
        const names = functions_1.array_unique(lodash_1.flatten(fields)).map(this.convention.formatFieldName);
        if (typeof this.fields.select === 'undefined') {
            this.fields.select = names;
        }
        else {
            this.fields.select = functions_1.array_unique(this.fields.select.concat(names));
        }
        return this;
    }
    orderBy(field, direction = 'asc') {
        this.ordering.set(this.convention.formatFieldName(field), direction);
        return this;
    }
    limit(records) {
        this.limitNumber = records;
        return this;
    }
    where(arg0, arg1, arg2) {
        this.conditions.push(QueryCondition_1.QueryCondition.create(this.convention, Operator_1.Operator.And, arg0, arg1, arg2));
        return this;
    }
    orWhere(arg0, arg1, arg2) {
        this.conditions.push(QueryCondition_1.QueryCondition.create(this.convention, Operator_1.Operator.Or, arg0, arg1, arg2));
        return this;
    }
}
exports.BasicQuery = BasicQuery;
