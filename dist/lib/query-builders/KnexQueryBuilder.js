"use strict";
/// <reference path="interfaces/ISoftDeleteQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const KnexProviderFacade_1 = require("./../facades/global/KnexProviderFacade");
const constants_1 = require("../constants");
const QueryBuilderBase_1 = require("./QueryBuilderBase");
class KnexQueryBuilder extends QueryBuilderBase_1.QueryBuilderBase {
    constructor(table, primaryKeyName, softDelete) {
        super();
        this.table = table;
        this.primaryKeyName = primaryKeyName;
        this.softDelete = softDelete;
        this.knex = KnexProviderFacade_1.KnexProvider.create(table);
    }
    orderBy(field, direction) {
        this.isUsed = true;
        this.knex.orderBy(field, direction);
        return this;
    }
}
exports.KnexQueryBuilder = KnexQueryBuilder;
// getPrimaryKeyName orderByAsc orderByDesc
// withTrashed onlyTrashed
const methods = [
    // NajsEloquent.QueryBuilder.IBasicQuery
    'select',
    'limit'
].concat(constants_1.QueryFunctions.ConditionQuery);
// implicit forwards method to knex
for (const name of methods) {
    KnexQueryBuilder.prototype[name] = function () {
        this['isUsed'] = true;
        this['knex'][name](...arguments);
        return this;
    };
}
