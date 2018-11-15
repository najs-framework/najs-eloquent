"use strict";
/// <reference path="../../definitions/query-grammars/IBasicConditionQuery.ts" />
/// <reference path="../../definitions/query-builders/IConvention.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Operator_1 = require("./Operator");
class ConditionQueryHandler {
    constructor(basicConditionQuery, convention) {
        this.basicConditionQuery = basicConditionQuery;
        this.convention = convention;
    }
    where(arg0, arg1, arg2) {
        this.basicConditionQuery.where(arg0, arg1, arg2);
        return this;
    }
    orWhere(arg0, arg1, arg2) {
        this.basicConditionQuery.orWhere(arg0, arg1, arg2);
        return this;
    }
    andWhere(arg0, arg1, arg2) {
        return this.where(arg0, arg1, arg2);
    }
    whereNot(field, values) {
        return this.where(field, Operator_1.Operator.NotEquals, values);
    }
    andWhereNot(field, values) {
        return this.whereNot(field, values);
    }
    orWhereNot(field, values) {
        return this.orWhere(field, Operator_1.Operator.NotEquals, values);
    }
    whereIn(field, values) {
        return this.where(field, Operator_1.Operator.In, values);
    }
    andWhereIn(field, values) {
        return this.whereIn(field, values);
    }
    orWhereIn(field, values) {
        return this.orWhere(field, Operator_1.Operator.In, values);
    }
    whereNotIn(field, values) {
        return this.where(field, Operator_1.Operator.NotIn, values);
    }
    andWhereNotIn(field, values) {
        return this.whereNotIn(field, values);
    }
    orWhereNotIn(field, values) {
        return this.orWhere(field, Operator_1.Operator.NotIn, values);
    }
    whereNull(field) {
        return this.where(field, Operator_1.Operator.Equals, this.convention.getNullValueFor(field));
    }
    andWhereNull(field) {
        return this.whereNull(field);
    }
    orWhereNull(field) {
        return this.orWhere(field, Operator_1.Operator.Equals, this.convention.getNullValueFor(field));
    }
    whereNotNull(field) {
        return this.where(field, Operator_1.Operator.NotEquals, this.convention.getNullValueFor(field));
    }
    andWhereNotNull(field) {
        return this.whereNotNull(field);
    }
    orWhereNotNull(field) {
        return this.orWhere(field, Operator_1.Operator.NotEquals, this.convention.getNullValueFor(field));
    }
    whereBetween(field, range) {
        return this.where(field, Operator_1.Operator.GreaterThanOrEquals, range[0]).where(field, Operator_1.Operator.LessThanOrEquals, range[1]);
    }
    andWhereBetween(field, range) {
        return this.whereBetween(field, range);
    }
    orWhereBetween(field, range) {
        return this.orWhere(function (subQuery) {
            subQuery.where(field, Operator_1.Operator.GreaterThanOrEquals, range[0]).where(field, Operator_1.Operator.LessThanOrEquals, range[1]);
        });
    }
    whereNotBetween(field, range) {
        return this.where(function (subQuery) {
            subQuery.where(field, Operator_1.Operator.LessThan, range[0]).orWhere(field, Operator_1.Operator.GreaterThan, range[1]);
        });
    }
    andWhereNotBetween(field, range) {
        return this.whereNotBetween(field, range);
    }
    orWhereNotBetween(field, range) {
        return this.orWhere(function (subQuery) {
            subQuery.where(field, Operator_1.Operator.LessThan, range[0]).orWhere(field, Operator_1.Operator.GreaterThan, range[1]);
        });
    }
}
exports.ConditionQueryHandler = ConditionQueryHandler;
