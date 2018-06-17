"use strict";
/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const MongodbQueryBuilderBase_1 = require("./MongodbQueryBuilderBase");
const constants_1 = require("../../constants");
const Moment = require("moment");
class MongodbQueryBuilder extends MongodbQueryBuilderBase_1.MongodbQueryBuilderBase {
    constructor(modelName, collection, softDelete, timestamps, primaryKey = '_id') {
        super(softDelete);
        this.modelName = modelName;
        this.collection = collection;
        this.timestamps = timestamps;
        this.primaryKey = primaryKey;
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryBuilder.MongodbQueryBuilder;
    }
    get() {
        const query = this.resolveMongodbConditionConverter().convert();
        const options = this.createQueryOptions();
        const logger = this.resolveMongodbQueryLog();
        this.logQueryAndOptions(logger, query, options, 'find')
            .raw('.toArray()')
            .end();
        return this.collection.find(query, options).toArray();
    }
    first() {
        const query = this.resolveMongodbConditionConverter().convert();
        const options = this.createQueryOptions();
        const logger = this.resolveMongodbQueryLog();
        this.logQueryAndOptions(logger, query, options, 'findOne').end();
        return this.collection.findOne(query, options);
    }
    count() {
        if (this.fields.select) {
            this.fields.select = [];
        }
        if (!lodash_1.isEmpty(this.ordering)) {
            this.ordering = {};
        }
        const query = this.resolveMongodbConditionConverter().convert();
        const options = this.createQueryOptions();
        const logger = this.resolveMongodbQueryLog();
        this.logQueryAndOptions(logger, query, options, 'count').end();
        return this.collection.count(query);
    }
    update(data) {
        const conditions = this.resolveMongodbConditionConverter().convert();
        if (this.timestamps) {
            if (typeof data['$set'] === 'undefined') {
                data['$set'] = {};
            }
            data['$set'][this.timestamps.updatedAt] = Moment().toDate();
        }
        this.resolveMongodbQueryLog()
            .raw('db.', this.collection.collectionName, '.updateMany(', conditions, ', ', data, ')')
            .end();
        return this.collection.updateMany(conditions, data).then(function (response) {
            return response.result;
        });
    }
    delete() {
        const conditions = this.isNotUsedOrEmptyCondition();
        if (conditions === false) {
            return Promise.resolve({ n: 0, ok: 1 });
        }
        this.resolveMongodbQueryLog()
            .raw('db.', this.collection.collectionName, '.deleteMany(', conditions, ')')
            .end();
        return this.collection.deleteMany(conditions).then(function (response) {
            return response.result;
        });
    }
    async restore() {
        if (!this.softDelete) {
            return { n: 0, nModified: 0, ok: 1 };
        }
        const conditions = this.isNotUsedOrEmptyCondition();
        if (conditions === false) {
            return { n: 0, nModified: 0, ok: 1 };
        }
        const query = this.resolveMongodbConditionConverter().convert();
        const data = {
            $set: { [this.softDelete.deletedAt]: this.convention.getNullValueFor(this.softDelete.deletedAt) }
        };
        this.resolveMongodbQueryLog()
            .raw('db.', this.collection.collectionName, '.updateMany(', conditions, ', ', data, ')')
            .end();
        return this.collection.updateMany(query, data).then(function (response) {
            return response.result;
        });
    }
    execute() {
        if (this.nativeHandlePromise) {
            return this.nativeHandlePromise.then((response) => {
                this.nativeHandlePromise = undefined;
                return response.result || response;
            });
        }
        return this.get();
    }
    native(handler) {
        const conditions = this.resolveMongodbConditionConverter().convert();
        const options = this.createQueryOptions();
        this.nativeHandlePromise = handler(this.collection, conditions, options);
        return this;
    }
    // -------------------------------------------------------------------------------------------------------------------
    logQueryAndOptions(logger, query, options, func) {
        return logger.raw('db.', this.collection.collectionName, `.${func}(`, query).raw(options ? ', ' : '', options, ')');
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
