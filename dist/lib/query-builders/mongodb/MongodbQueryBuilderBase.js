"use strict";
/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const MongodbConditionConverter_1 = require("./MongodbConditionConverter");
const GenericQueryBuilder_1 = require("../GenericQueryBuilder");
const MongodbQueryLog_1 = require("./MongodbQueryLog");
const lodash_1 = require("lodash");
class MongodbQueryBuilderBase extends GenericQueryBuilder_1.GenericQueryBuilder {
    getPrimaryKey() {
        return this.primaryKey;
    }
    toObject() {
        const conditions = this.resolveMongodbConditionConverter().convert();
        return {
            name: this.name ? this.name : undefined,
            select: !lodash_1.isEmpty(this.fields.select) ? this.fields.select : undefined,
            limit: this.limitNumber,
            orderBy: !lodash_1.isEmpty(this.ordering) ? this.ordering : undefined,
            conditions: !lodash_1.isEmpty(conditions) ? conditions : undefined
        };
    }
    resolveMongodbConditionConverter() {
        return najs_binding_1.make(MongodbConditionConverter_1.MongodbConditionConverter.className, [this.getConditions()]);
    }
    resolveMongodbQueryLog() {
        const data = this.toObject();
        data['builder'] = this.getClassName();
        return najs_binding_1.make(MongodbQueryLog_1.MongodbQueryLog.className, [data]);
    }
    isNotUsedOrEmptyCondition() {
        if (!this.isUsed) {
            return false;
        }
        const conditions = this.resolveMongodbConditionConverter().convert();
        if (lodash_1.isEmpty(conditions)) {
            return false;
        }
        return conditions;
    }
    getQueryConvention() {
        return {
            formatFieldName(name) {
                if (name === 'id') {
                    return '_id';
                }
                return name;
            },
            getNullValueFor(name) {
                // tslint:disable-next-line
                return null;
            }
        };
    }
}
exports.MongodbQueryBuilderBase = MongodbQueryBuilderBase;
