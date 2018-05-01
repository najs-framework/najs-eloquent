"use strict";
/// <reference path="interfaces/IQueryConvention.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class GenericQueryConditionHelpers {
    andWhere(arg0, arg1, arg2) {
        return this.where(arg0, arg1, arg2);
    }
    whereNot(field, values) {
        return this.where(field, '<>', values);
    }
    andWhereNot(field, values) {
        return this.whereNot(field, values);
    }
    orWhereNot(field, values) {
        return this.orWhere(field, '<>', values);
    }
    whereIn(field, values) {
        return this.where(field, 'in', values);
    }
    andWhereIn(field, values) {
        return this.whereIn(field, values);
    }
    orWhereIn(field, values) {
        return this.orWhere(field, 'in', values);
    }
    whereNotIn(field, values) {
        return this.where(field, 'not-in', values);
    }
    andWhereNotIn(field, values) {
        return this.whereNotIn(field, values);
    }
    orWhereNotIn(field, values) {
        return this.orWhere(field, 'not-in', values);
    }
    whereNull(field) {
        return this.where(field, '=', this.convention.getNullValueFor(field));
    }
    andWhereNull(field) {
        return this.whereNull(field);
    }
    orWhereNull(field) {
        return this.orWhere(field, '=', this.convention.getNullValueFor(field));
    }
    whereNotNull(field) {
        return this.where(field, '<>', this.convention.getNullValueFor(field));
    }
    andWhereNotNull(field) {
        return this.whereNotNull(field);
    }
    orWhereNotNull(field) {
        return this.orWhere(field, '<>', this.convention.getNullValueFor(field));
    }
    whereBetween(field, range) {
        return this.where(field, '>=', range[0]).where(field, '<=', range[1]);
    }
    andWhereBetween(field, range) {
        return this.whereBetween(field, range);
    }
    orWhereBetween(field, range) {
        return this.orWhere(function (subQuery) {
            subQuery.where(field, '>=', range[0]).where(field, '<=', range[1]);
        });
    }
    whereNotBetween(field, range) {
        return this.where(function (subQuery) {
            subQuery.where(field, '<', range[0]).orWhere(field, '>', range[1]);
        });
    }
    andWhereNotBetween(field, range) {
        return this.whereNotBetween(field, range);
    }
    orWhereNotBetween(field, range) {
        return this.orWhere(function (subQuery) {
            subQuery.where(field, '<', range[0]).orWhere(field, '>', range[1]);
        });
    }
    static get FUNCTIONS() {
        return Object.getOwnPropertyNames(GenericQueryConditionHelpers.prototype).filter(item => item !== 'constructor');
    }
}
exports.GenericQueryConditionHelpers = GenericQueryConditionHelpers;
