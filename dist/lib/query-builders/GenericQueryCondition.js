"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class GenericQueryCondition {
    constructor() {
        this.isSubQuery = false;
        this.queries = [];
    }
    static create(convention, operator, arg0, arg1, arg2) {
        const condition = new GenericQueryCondition();
        condition.convention = convention;
        condition.buildQuery(operator, arg0, arg1, arg2);
        return condition;
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
            queryCondition = new GenericQueryCondition();
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
        const query = new GenericQueryCondition();
        query.convention = this.convention;
        query.isSubQuery = true;
        arg0.call(undefined, query);
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
    whereIn(field, values) {
        return this.buildQuery('and', field, 'in', values);
    }
    whereNotIn(field, values) {
        return this.buildQuery('and', field, 'not-in', values);
    }
    orWhereIn(field, values) {
        return this.buildQuery('or', field, 'in', values);
    }
    orWhereNotIn(field, values) {
        return this.buildQuery('or', field, 'not-in', values);
    }
    whereNull(field) {
        return this.buildQuery('and', field, '=', this.convention.getNullValueFor(field));
    }
    whereNotNull(field) {
        return this.buildQuery('and', field, '<>', this.convention.getNullValueFor(field));
    }
    orWhereNull(field) {
        return this.buildQuery('or', field, '=', this.convention.getNullValueFor(field));
    }
    orWhereNotNull(field) {
        return this.buildQuery('or', field, '<>', this.convention.getNullValueFor(field));
    }
}
exports.GenericQueryCondition = GenericQueryCondition;
