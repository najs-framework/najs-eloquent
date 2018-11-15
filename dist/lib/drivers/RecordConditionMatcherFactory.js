"use strict";
/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const RecordConditionMatcher_1 = require("./RecordConditionMatcher");
const constants_1 = require("../constants");
class RecordConditionMatcherFactory {
    getClassName() {
        return constants_1.NajsEloquent.Driver.Memory.RecordConditionMatcherFactory;
    }
    make(data) {
        return new RecordConditionMatcher_1.RecordConditionMatcher(data.field, data.operator, data.value);
    }
    transform(matcher) {
        return matcher;
    }
}
RecordConditionMatcherFactory.className = constants_1.NajsEloquent.Driver.Memory.RecordConditionMatcherFactory;
exports.RecordConditionMatcherFactory = RecordConditionMatcherFactory;
najs_binding_1.register(RecordConditionMatcherFactory, constants_1.NajsEloquent.Driver.Memory.RecordConditionMatcherFactory, true, true);
