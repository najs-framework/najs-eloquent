"use strict";
/// <reference path="../../definitions/query-builders/IConvention.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultConvention {
    formatFieldName(name) {
        return name;
    }
    getNullValueFor(name) {
        // tslint:disable-next-line
        return null;
    }
}
exports.DefaultConvention = DefaultConvention;
