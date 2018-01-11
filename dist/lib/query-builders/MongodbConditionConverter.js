"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class MongodbConditionConverter {
    constructor(queryConditions) {
        this.queryConditions = queryConditions;
    }
    convert() {
        return this.convertConditions(this.queryConditions);
    }
    convertConditions(conditions) {
        const result = {};
        for (let i = 0, l = conditions.length; i < l; i++) {
            // fix edge case: `query.orWhere().where()...`
            if (i === 0 && conditions[i].bool === 'or') {
                conditions[i].bool = 'and';
            }
            // always change previous statement of OR bool to OR
            if (conditions[i].bool === 'or' && conditions[i - 1].bool === 'and') {
                conditions[i - 1].bool = 'or';
            }
        }
        this.convertConditionsWithAnd(result, conditions.filter(item => item['bool'] === 'and'));
        this.convertConditionsWithOr(result, conditions.filter(item => item['bool'] === 'or'));
        if (Object.keys(result).length === 1 && typeof result['$and'] !== 'undefined' && result['$and'].length === 1) {
            return result['$and'][0];
        }
        return result;
    }
    hasAnyIntersectKey(a, b) {
        const keyOfA = Object.keys(a);
        const keyOfB = Object.keys(b);
        for (const key of keyOfB) {
            if (keyOfA.indexOf(key) !== -1) {
                return true;
            }
        }
        return false;
    }
    convertConditionsWithAnd(bucket, conditions) {
        let result = {};
        for (const condition of conditions) {
            const query = this.convertCondition(condition);
            if (this.hasAnyIntersectKey(result, query) && !Array.isArray(result)) {
                result = [result];
            }
            if (Array.isArray(result)) {
                result.push(query);
                continue;
            }
            Object.assign(result, query);
        }
        if (Array.isArray(result)) {
            Object.assign(bucket, { $and: result });
            return;
        }
        const keysLength = Object.keys(result).length;
        if (keysLength === 1) {
            Object.assign(bucket, result);
        }
        if (keysLength > 1) {
            Object.assign(bucket, { $and: [result] });
        }
    }
    convertConditionsWithOr(bucket, conditions) {
        const result = [];
        for (const condition of conditions) {
            const query = this.convertCondition(condition);
            result.push(Object.assign({}, query));
        }
        if (result.length > 1) {
            Object.assign(bucket, { $or: result });
        }
    }
    convertCondition(condition) {
        if (typeof condition['queries'] === 'undefined') {
            return this.convertSimpleCondition(condition);
        }
        return this.convertGroupOfCondition(condition);
    }
    convertGroupOfCondition(condition) {
        if (!condition.queries || condition.queries.length === 0) {
            return {};
        }
        if (condition.queries.length === 1) {
            return this.convertCondition(condition.queries[0]);
        }
        const result = this.convertConditions(condition.queries);
        if (Object.keys(result).length === 0) {
            return {};
        }
        if (condition.bool === 'and') {
            if (Object.keys(result).length === 1) {
                return result;
            }
            return { $and: [result] };
        }
        if (Object.keys(result).length === 1 && typeof result['$or'] !== 'undefined') {
            return result;
        }
        return { $or: [result] };
    }
    convertSimpleCondition(condition) {
        if (typeof condition.value === 'undefined') {
            return {};
        }
        switch (condition.operator) {
            case '=':
            case '==':
                return lodash_1.set({}, condition.field, condition.value);
            case '!=':
            case '<>':
                return lodash_1.set({}, condition.field, { $not: condition.value });
            case '<':
                return lodash_1.set({}, condition.field, { $lt: condition.value });
            case '<=':
            case '=<':
                return lodash_1.set({}, condition.field, { $lte: condition.value });
            case '>':
                return lodash_1.set({}, condition.field, { $gt: condition.value });
            case '>=':
            case '=>':
                return lodash_1.set({}, condition.field, { $gte: condition.value });
            case 'in':
                return lodash_1.set({}, condition.field, { $in: condition.value });
            case 'not-in':
                return lodash_1.set({}, condition.field, { $nin: condition.value });
        }
    }
}
exports.MongodbConditionConverter = MongodbConditionConverter;
