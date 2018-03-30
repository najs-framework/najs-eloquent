"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericQueryCondition_1 = require("./GenericQueryCondition");
const lodash_1 = require("lodash");
class GenericQueryBuilder {
    constructor(softDelete) {
        this.fields = {};
        this.ordering = {};
        this.conditions = [];
        this.convention = this.getQueryConvention();
        this.softDelete = softDelete;
        this.isUsed = false;
        this.addSoftDeleteCondition = !!softDelete ? true : false;
    }
    getQueryConvention() {
        return {
            formatFieldName(name) {
                return name;
            },
            getNullValueFor(name) {
                // tslint:disable-next-line
                return null;
            }
        };
    }
    getConditions() {
        if (this.softDelete && this.addSoftDeleteCondition) {
            this.whereNull(this.softDelete.deletedAt);
        }
        return this.conditions.map(item => item.toObject());
    }
    flattenFieldNames(type, fields) {
        this.isUsed = true;
        this.fields[type] = Array.from(new Set(lodash_1.flatten(fields))).map(this.convention.formatFieldName);
        return this;
    }
    queryName(name) {
        this.name = name;
        return this;
    }
    getPrimaryKey() {
        return this.convention.formatFieldName('id');
    }
    setLogGroup(group) {
        this.logGroup = group;
        return this;
    }
    select() {
        return this.flattenFieldNames('select', arguments);
    }
    distinct() {
        return this.flattenFieldNames('distinct', arguments);
    }
    orderBy(field, direction = 'asc') {
        this.isUsed = true;
        this.ordering[this.convention.formatFieldName(field)] = direction;
        return this;
    }
    orderByAsc(field) {
        return this.orderBy(field, 'asc');
    }
    orderByDesc(field) {
        return this.orderBy(field, 'desc');
    }
    limit(records) {
        this.isUsed = true;
        this.limitNumber = records;
        return this;
    }
    createConditionQuery(operator, arg0, arg1, arg2) {
        this.isUsed = true;
        this.conditions.push(GenericQueryCondition_1.GenericQueryCondition.create(this.convention, operator, arg0, arg1, arg2));
        return this;
    }
    where(arg0, arg1, arg2) {
        return this.createConditionQuery('and', arg0, arg1, arg2);
    }
    orWhere(arg0, arg1, arg2) {
        return this.createConditionQuery('or', arg0, arg1, arg2);
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
        return this.where(field, this.convention.getNullValueFor(field));
    }
    whereNotNull(field) {
        return this.where(field, '<>', this.convention.getNullValueFor(field));
    }
    orWhereNull(field) {
        return this.orWhere(field, this.convention.getNullValueFor(field));
    }
    orWhereNotNull(field) {
        return this.orWhere(field, '<>', this.convention.getNullValueFor(field));
    }
    withTrashed() {
        if (this.softDelete) {
            this.addSoftDeleteCondition = false;
            this.isUsed = true;
        }
        return this;
    }
    onlyTrashed() {
        if (this.softDelete) {
            this.addSoftDeleteCondition = false;
            this.whereNotNull(this.softDelete.deletedAt);
            this.isUsed = true;
        }
        return this;
    }
}
exports.GenericQueryBuilder = GenericQueryBuilder;
