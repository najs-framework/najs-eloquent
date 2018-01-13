"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryConditionBuilder_1 = require("./QueryConditionBuilder");
const lodash_1 = require("lodash");
class QueryBuilder {
    constructor(softDelete) {
        this.selectedFields = [];
        this.distinctFields = [];
        this.ordering = {};
        this.conditions = [];
        this.softDelete = softDelete;
        this.isUsed = false;
        this.addSoftDeleteCondition = softDelete ? true : false;
    }
    getFieldByName(name) {
        return name;
    }
    getNullValue(name) {
        // tslint:disable-next-line
        return null;
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
        this[name] = Array.from(new Set(result)).map(this.getFieldByName);
        return this;
    }
    getConditions() {
        if (this.softDelete && this.addSoftDeleteCondition) {
            this.whereNull(this.softDelete.deletedAt);
        }
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
        this.ordering[this.getFieldByName(field)] = direction;
        return this;
    }
    orderByAsc(field) {
        this.isUsed = true;
        this.ordering[this.getFieldByName(field)] = 'asc';
        return this;
    }
    orderByDesc(field) {
        this.isUsed = true;
        this.ordering[this.getFieldByName(field)] = 'desc';
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
        condition.where(this.getFieldByName(arg0), arg1, arg2);
        this.conditions.push(condition);
        return this;
    }
    orWhere(arg0, arg1, arg2) {
        this.isUsed = true;
        const condition = new QueryConditionBuilder_1.QueryCondition();
        condition.orWhere(this.getFieldByName(arg0), arg1, arg2);
        this.conditions.push(condition);
        return this;
    }
    whereIn(field, values) {
        return this.where(field, 'in', values);
    }
    whereNotIn(field, values) {
        return this.where(field, 'not-in', values);
    }
    orWhereIn(field, values) {
        return this.orWhere(field, 'in', values);
    }
    orWhereNotIn(field, values) {
        return this.orWhere(field, 'not-in', values);
    }
    whereNull(field) {
        return this.where(field, this.getNullValue(field));
    }
    whereNotNull(field) {
        return this.where(field, '<>', this.getNullValue(field));
    }
    orWhereNull(field) {
        return this.orWhere(field, this.getNullValue(field));
    }
    orWhereNotNull(field) {
        return this.orWhere(field, '<>', this.getNullValue(field));
    }
    withTrash() {
        if (this.softDelete) {
            this.addSoftDeleteCondition = false;
            this.isUsed = true;
        }
        return this;
    }
    onlyTrash() {
        if (this.softDelete) {
            this.addSoftDeleteCondition = false;
            this.whereNotNull(this.softDelete.deletedAt);
            this.isUsed = true;
        }
        return this;
    }
}
exports.QueryBuilder = QueryBuilder;
