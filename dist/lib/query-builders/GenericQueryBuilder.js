"use strict";
/// <reference path="interfaces/IBasicQuery.ts" />
/// <reference path="interfaces/IConditionQuery.ts" />
/// <reference path="interfaces/ISoftDeleteQuery.ts" />
/// <reference path="interfaces/IQueryConvention.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const GenericQueryCondition_1 = require("./GenericQueryCondition");
const GenericQueryConditionHelpers_1 = require("./GenericQueryConditionHelpers");
const lodash_1 = require("lodash");
const functions_1 = require("../util/functions");
const QueryBuilderBase_1 = require("./QueryBuilderBase");
class GenericQueryBuilder extends QueryBuilderBase_1.QueryBuilderBase {
    constructor(softDelete) {
        super();
        this.fields = {};
        this.ordering = {};
        this.conditions = [];
        this.softDelete = softDelete;
        this.isUsed = false;
        this.addSoftDeleteCondition = !!softDelete ? true : false;
    }
    getConditions() {
        if (this.softDelete && this.addSoftDeleteCondition) {
            this.whereNull(this.softDelete.deletedAt);
        }
        return this.conditions.map(item => item.toObject());
    }
    flattenFieldNames(type, fields) {
        this.isUsed = true;
        this.fields[type] = functions_1.array_unique(lodash_1.flatten(fields)).map(this.convention.formatFieldName);
        return this;
    }
    select() {
        return this.flattenFieldNames('select', arguments);
    }
    orderBy(field, direction = 'asc') {
        this.isUsed = true;
        this.ordering[this.convention.formatFieldName(field)] = direction;
        return this;
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
// implicit implements the other .where... condition
for (const fn of GenericQueryConditionHelpers_1.GenericQueryConditionHelpers.FUNCTIONS) {
    GenericQueryBuilder.prototype[fn] = GenericQueryConditionHelpers_1.GenericQueryConditionHelpers.prototype[fn];
}
