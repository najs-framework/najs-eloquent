"use strict";
/// <reference path="interfaces/ISoftDeleteQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("./KnexQueryLog");
const KnexProviderFacade_1 = require("./../facades/global/KnexProviderFacade");
const constants_1 = require("../constants");
const QueryBuilderBase_1 = require("./QueryBuilderBase");
const constants_2 = require("../constants");
const najs_binding_1 = require("najs-binding");
class KnexQueryBuilder extends QueryBuilderBase_1.QueryBuilderBase {
    constructor(table, primaryKeyName, configName, softDelete) {
        super();
        this.table = table;
        this.primaryKeyName = primaryKeyName;
        this.configName = configName;
        this.softDelete = softDelete;
        this.addSoftDeleteCondition = !!softDelete ? true : false;
        this.addedSoftDeleteCondition = false;
    }
    getClassName() {
        return constants_2.NajsEloquent.QueryBuilder.KnexQueryBuilder;
    }
    getKnexQueryBuilder() {
        if (!this.knexQueryBuilder) {
            this.knexQueryBuilder = KnexProviderFacade_1.KnexProvider.createQueryBuilder(this.table, this.configName);
        }
        if (this.softDelete && this.addSoftDeleteCondition && !this.addedSoftDeleteCondition) {
            this.knexQueryBuilder.whereNull(this.softDelete.deletedAt);
            this.addedSoftDeleteCondition = true;
        }
        return this.knexQueryBuilder;
    }
    orderBy(field, direction) {
        this.isUsed = true;
        this.getKnexQueryBuilder().orderBy(field, direction);
        return this;
    }
    withTrashed() {
        if (this.softDelete) {
            this.addSoftDeleteCondition = false;
            this.isUsed = true;
        }
        return this;
    }
    onlyTrashed() {
        if (this.softDelete) {
            this.addSoftDeleteCondition = false;
            this.whereNotNull(this.softDelete.deletedAt);
            this.isUsed = true;
        }
        return this;
    }
    // -------------------------------------------------------------------------------------------------------------------
    get() {
        return new Promise(resolve => {
            const queryBuilder = this.getKnexQueryBuilder();
            this.resolveKnexQueryLog().log(this);
            queryBuilder.then(resolve);
        });
    }
    first() {
        return new Promise(resolve => {
            const queryBuilder = this.getKnexQueryBuilder();
            queryBuilder.first();
            this.resolveKnexQueryLog().log(this);
            queryBuilder.then(function (result) {
                if (result) {
                    return resolve(result);
                }
                // tslint:disable-next-line
                return resolve(null);
            });
        });
    }
    count() {
        return new Promise(resolve => {
            const queryBuilder = this.getKnexQueryBuilder();
            queryBuilder.clearSelect().count();
            this.resolveKnexQueryLog().log(this);
            queryBuilder.then(function (result) {
                const keys = Object.keys(result[0]);
                resolve(result[0][keys[0]]);
            });
        });
    }
    update(data) {
        return new Promise(resolve => {
            const queryBuilder = this.getKnexQueryBuilder();
            queryBuilder.update(data);
            this.resolveKnexQueryLog().log(this);
            queryBuilder.then(resolve);
        });
    }
    delete() {
        return new Promise(resolve => {
            const queryBuilder = this.getKnexQueryBuilder();
            queryBuilder.delete();
            this.resolveKnexQueryLog().log(this);
            queryBuilder.then(resolve);
        });
    }
    restore() {
        return new Promise(resolve => {
            if (!this.softDelete) {
                resolve(0);
            }
            const queryBuilder = this.getKnexQueryBuilder();
            const data = { [this.softDelete.deletedAt]: this.convention.getNullValueFor(this.softDelete.deletedAt) };
            queryBuilder.update(data);
            this.resolveKnexQueryLog().log(this);
            queryBuilder.then(resolve);
        });
    }
    execute() {
        return new Promise(resolve => {
            return this.getKnexQueryBuilder().then(resolve);
        });
    }
    native(handler) {
        handler(this.getKnexQueryBuilder());
        return this;
    }
    resolveKnexQueryLog() {
        return najs_binding_1.make(constants_2.NajsEloquent.QueryBuilder.KnexQueryLog, []);
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
najs_binding_1.register(KnexQueryBuilder, constants_2.NajsEloquent.QueryBuilder.KnexQueryBuilder);
