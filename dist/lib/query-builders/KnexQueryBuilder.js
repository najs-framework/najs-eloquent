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
    }
    getKnexQueryBuilder() {
        if (!this.knexQueryBuilder) {
            this.knexQueryBuilder = KnexProviderFacade_1.KnexProvider.createQueryBuilder(this.table);
        }
        return this.knexQueryBuilder;
    }
    orderBy(field, direction) {
        this.isUsed = true;
        this.getKnexQueryBuilder().orderBy(field, direction);
        return this;
    }
    // withTrashed() {
    //   return this
    // }
    // onlyTrashed() {
    //   return this
    // }
    // -------------------------------------------------------------------------------------------------------------------
    get() {
        return new Promise(resolve => {
            // const query = this.knexQueryBuilder.toQuery()
            // console.log(query)
            this.getKnexQueryBuilder().then(resolve);
        });
    }
}
exports.KnexQueryBuilder = KnexQueryBuilder;
const methods = [
    // NajsEloquent.QueryBuilder.IBasicQuery
    'select',
    'limit'
].concat(constants_1.QueryFunctions.ConditionQuery);
// implicit forwards method to knex
for (const name of methods) {
    KnexQueryBuilder.prototype[name] = function () {
        this['isUsed'] = true;
        this.getKnexQueryBuilder()[name](...arguments);
        return this;
    };
}
