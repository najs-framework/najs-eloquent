"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../relations/interfaces/IRelationDataBucket.ts" />
/// <reference path="interfaces/IQueryBuilderWrapper.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../relations/RelationDataBucket");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const NotFoundError_1 = require("../errors/NotFoundError");
const functions_1 = require("../util/functions");
const FORWARD_FUNCTIONS = functions_1.array_unique(constants_1.QueryFunctions.BasicQuery, constants_1.QueryFunctions.ConditionQuery, constants_1.QueryFunctions.SoftDeleteQuery, constants_1.QueryFunctions.FetchResultQuery.filter(item => item !== 'first' && item !== 'get'));
class QueryBuilderWrapper {
    constructor(model, recordName, queryBuilder) {
        this.modelName = model;
        this.recordName = recordName;
        this.queryBuilder = queryBuilder;
    }
    getClassName() {
        return constants_1.NajsEloquent.Wrapper.QueryBuilderWrapper;
    }
    createCollection(result) {
        return this.createEagerBucket().newCollection(this.recordName, result);
    }
    createInstance(result) {
        return this.createEagerBucket().newInstance(this.recordName, result);
    }
    createEagerBucket() {
        const eager = najs_binding_1.make(constants_1.NajsEloquent.Relation.RelationDataBucket, []);
        return eager.register(this.recordName, this.modelName);
    }
    async first(id) {
        if (typeof id !== 'undefined') {
            this.queryBuilder.where(this.queryBuilder.getPrimaryKeyName(), id);
        }
        const result = await this.queryBuilder.first();
        return result ? this.createInstance(result) : result;
    }
    async find(id) {
        return this.first(id);
    }
    async get(...fields) {
        if (arguments.length !== 0) {
            this.queryBuilder.select(...fields);
        }
        return this.createCollection(await this.queryBuilder.get());
    }
    async all(...fields) {
        return this.get(...fields);
    }
    async pluck(valueKey, indexKey) {
        const indexKeyName = typeof indexKey === 'undefined' ? this.queryBuilder.getPrimaryKeyName() : indexKey;
        const result = await this.queryBuilder.select(valueKey, indexKeyName).get();
        return result.reduce(function (memo, item) {
            memo[item[indexKeyName]] = item[valueKey];
            return memo;
        }, {});
    }
    async findById(id) {
        return this.first(id);
    }
    async findOrFail(id) {
        const result = await this.find(id);
        if (result === null) {
            throw new NotFoundError_1.NotFoundError(this.modelName);
        }
        return result;
    }
    async firstOrFail(id) {
        return this.findOrFail(id);
    }
    static get ForwardFunctions() {
        return FORWARD_FUNCTIONS;
    }
}
QueryBuilderWrapper.className = constants_1.NajsEloquent.Wrapper.QueryBuilderWrapper;
exports.QueryBuilderWrapper = QueryBuilderWrapper;
for (const name of FORWARD_FUNCTIONS) {
    QueryBuilderWrapper.prototype[name] = function () {
        const result = this['queryBuilder'][name](...arguments);
        return result === this['queryBuilder'] ? this : result;
    };
}
najs_binding_1.register(QueryBuilderWrapper);
