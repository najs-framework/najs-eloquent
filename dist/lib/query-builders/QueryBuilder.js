"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryConditionBuilder_1 = require("./QueryConditionBuilder");
const lodash_1 = require("lodash");
class QueryBuilder {
    constructor() {
        this.selectedFields = [];
        this.distinctFields = [];
        this.ordering = {};
        this.conditions = [];
        this.isUsed = false;
    }
    _flatten_and_assign_to(name, fields) {
        let result = [];
        for (let i = 0, l = fields.length; i < l; i++) {
            if (lodash_1.isString(fields[i])) {
                result.push(fields[i]);
                continue;
            }
            result = result.concat(fields[i]);
        }
        this[name] = Array.from(new Set(result));
        return this;
    }
    getConditions() {
        return this.conditions.map(item => item.toObject());
    }
    queryName(name) {
        this.name = name;
        return this;
    }
    select(...fields) {
        this.isUsed = true;
        return this._flatten_and_assign_to('selectedFields', fields);
    }
    distinct(...fields) {
        this.isUsed = true;
        return this._flatten_and_assign_to('distinctFields', fields);
    }
    orderBy(field, direction = 'asc') {
        this.isUsed = true;
        this.ordering[field] = direction;
        return this;
    }
    orderByAsc(field) {
        this.isUsed = true;
        this.ordering[field] = 'asc';
        return this;
    }
    orderByDesc(field) {
        this.isUsed = true;
        this.ordering[field] = 'desc';
        return this;
    }
    limit(records) {
        this.isUsed = true;
        this.limitNumber = records;
        return this;
    }
    where(arg0, arg1, arg2) {
        this.isUsed = true;
        const condition = new QueryConditionBuilder_1.QueryCondition();
        condition.where(arg0, arg1, arg2);
        this.conditions.push(condition);
        return this;
    }
    orWhere(arg0, arg1, arg2) {
        this.isUsed = true;
        const condition = new QueryConditionBuilder_1.QueryCondition();
        condition.orWhere(arg0, arg1, arg2);
        this.conditions.push(condition);
        return this;
    }
    whereIn(field, values) {
        this.isUsed = true;
        return this.where(field, 'in', values);
    }
    whereNotIn(field, values) {
        this.isUsed = true;
        return this.where(field, 'not-in', values);
    }
    orWhereIn(field, values) {
        this.isUsed = true;
        return this.orWhere(field, 'in', values);
    }
    orWhereNotIn(field, values) {
        this.isUsed = true;
        return this.orWhere(field, 'not-in', values);
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map