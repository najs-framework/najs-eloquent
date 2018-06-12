"use strict";
/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const MongodbQueryBuilderBase_1 = require("./MongodbQueryBuilderBase");
const constants_1 = require("../../constants");
class MongodbQueryBuilder extends MongodbQueryBuilderBase_1.MongodbQueryBuilderBase {
    constructor(modelName, collection, softDelete, primaryKey = '_id') {
        super(softDelete);
        this.modelName = modelName;
        this.collection = collection;
        this.primaryKey = primaryKey;
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryBuilder.MongodbQueryBuilder;
    }
    async get() {
        const logger = this.resolveMongodbQueryLog();
        const result = await this.createQuery(false, logger);
        logger.end();
        return result;
    }
    first() {
        throw new Error('Not implemented.');
    }
    count() {
        throw new Error('Not implemented.');
    }
    update(data) {
        throw new Error('Not implemented.');
    }
    delete() {
        throw new Error('Not implemented.');
    }
    restore() {
        throw new Error('Not implemented.');
    }
    execute() {
        throw new Error('Not implemented.');
    }
    // -------------------------------------------------------------------------------------------------------------------
    createQuery(isFindOne, logger) {
        const query = this.resolveMongodbConditionConverter().convert();
        const options = this.createQueryOptions();
        // if (isFindOne) {
        //   logger.raw('db.', this.collection.collectionName, '.findOne(', query, options ? ', ' : '', options, ')')
        //   return this.collection.findOne(query, options)
        // } else {
        logger
            .raw('db.', this.collection.collectionName, '.find(', query, options ? ', ' : '', options, ')')
            .raw('.toArray()');
        return this.collection.find(query, options).toArray();
        // }
    }
    createQueryOptions() {
        const options = {};
        if (this.limitNumber) {
            options['limit'] = this.limitNumber;
        }
        if (this.ordering && !lodash_1.isEmpty(this.ordering)) {
            options['sort'] = Object.keys(this.ordering).reduce((memo, key) => {
                memo.push([key, this.ordering[key] === 'asc' ? 1 : -1]);
                return memo;
            }, []);
        }
        if (!lodash_1.isEmpty(this.fields.select)) {
            options['projection'] = this.fields.select.reduce((memo, key) => {
                memo[key] = 1;
                return memo;
            }, {});
        }
        return lodash_1.isEmpty(options) ? undefined : options;
    }
}
exports.MongodbQueryBuilder = MongodbQueryBuilder;
najs_binding_1.register(MongodbQueryBuilder, constants_1.NajsEloquent.QueryBuilder.MongodbQueryBuilder);
