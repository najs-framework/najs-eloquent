"use strict";
/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Lodash = require("lodash");
class DataConditionMatcher {
    constructor(field, operator, value, reader) {
        this.field = field;
        this.operator = operator;
        this.value = reader.toComparable(value);
        if (this.value !== value) {
            this.originalValue = value;
        }
        this.reader = reader;
    }
    isEqual(record) {
        return Lodash.isEqual(this.reader.getAttribute(record, this.field), this.value);
    }
    isLessThan(record) {
        return Lodash.lt(this.reader.getAttribute(record, this.field), this.value);
    }
    isLessThanOrEqual(record) {
        return Lodash.lte(this.reader.getAttribute(record, this.field), this.value);
    }
    isGreaterThan(record) {
        return Lodash.gt(this.reader.getAttribute(record, this.field), this.value);
    }
    isGreaterThanOrEqual(record) {
        return Lodash.gte(this.reader.getAttribute(record, this.field), this.value);
    }
    isInArray(record) {
        return Lodash.includes(this.value, this.reader.getAttribute(record, this.field));
    }
    isMatch(record) {
        switch (this.operator) {
            case '=':
            case '==':
                return this.isEqual(record);
            case '!=':
            case '<>':
                return !this.isEqual(record);
            case '<':
                return this.isLessThan(record);
            case '<=':
            case '=<':
                return this.isLessThanOrEqual(record);
            case '>':
                return this.isGreaterThan(record);
            case '>=':
            case '=>':
                return this.isGreaterThanOrEqual(record);
            case 'in':
                return this.isInArray(record);
            case 'not-in':
                return !this.isInArray(record);
            default:
                return false;
        }
    }
}
exports.DataConditionMatcher = DataConditionMatcher;
