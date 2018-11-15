"use strict";
/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const DataConditionMatcher_1 = require("../data/DataConditionMatcher");
const RecordDataReader_1 = require("./RecordDataReader");
class RecordConditionMatcher extends DataConditionMatcher_1.DataConditionMatcher {
    constructor(field, operator, value) {
        super(field, operator, value, RecordDataReader_1.RecordDataReader);
    }
    toJSON() {
        return {
            field: this.field,
            operator: this.operator,
            value: this.value
        };
    }
}
exports.RecordConditionMatcher = RecordConditionMatcher;
