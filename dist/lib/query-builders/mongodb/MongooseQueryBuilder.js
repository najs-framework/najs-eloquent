"use strict";
/// <reference path="../interfaces/IQueryConvention.ts" />
/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />
/// <reference path="../../model/interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const MongooseProviderFacade_1 = require("../../facades/global/MongooseProviderFacade");
const MongodbQueryBuilderBase_1 = require("./MongodbQueryBuilderBase");
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
class MongooseQueryBuilder extends MongodbQueryBuilderBase_1.MongodbQueryBuilderBase {
    constructor(modelName, softDelete, primaryKey = '_id') {
        super(softDelete);
        this.primaryKey = primaryKey;
        const mongoose = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance();
        if (mongoose.modelNames().indexOf(modelName) === -1) {
            throw new Error('Model ' + modelName + ' Not Found');
        }
        this.mongooseModel = mongoose.model(modelName);
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryBuilder.MongooseQueryBuilder;
    }
    native(handler) {
        this.mongooseQuery = handler.call(undefined, this.isUsed ? this.createQuery(false) : this.mongooseModel);
        this.hasMongooseQuery = true;
        return this;
    }
    async get() {
        const logger = this.resolveMongodbQueryLog();
        const query = this.createQuery(false, logger);
        logger
            .raw('.exec()')
            .action('get')
            .end();
        return (await query.exec());
    }
    async first() {
        const logger = this.resolveMongodbQueryLog();
        const query = this.passDataToMongooseQuery(this.getQuery(true, logger), logger);
        // change mongoose query operator from find to findOne if needed
        if (query['op'] === 'find') {
            query.findOne();
            logger.raw('.fineOne()');
        }
        logger
            .raw('.exec()')
            .action('find')
            .end();
        return await query.exec();
    }
    async count() {
        const logger = this.resolveMongodbQueryLog().action('count');
        this.selectedFields = [];
        this.select(this.primaryKey);
        const query = this.createQuery(false, logger);
        logger.raw('.count().exec()').end();
        const result = await query.count().exec();
        return result;
    }
    async update(data) {
        const conditions = this.resolveMongodbConditionConverter().convert();
        const query = this.mongooseModel.update(conditions, data, {
            multi: true
        });
        this.resolveMongodbQueryLog()
            .action('update')
            .raw(this.mongooseModel.modelName)
            .raw(`.update(${JSON.stringify(conditions)}, ${JSON.stringify(data)}, {multi: true})`)
            .raw('.exec()')
            .end();
        return query.exec();
    }
    async delete() {
        const conditions = this.isNotUsedOrEmptyCondition();
        if (conditions === false) {
            return { n: 0, ok: 1 };
        }
        this.resolveMongodbQueryLog()
            .raw(this.mongooseModel.modelName)
            .raw('.remove(', conditions, ')', '.exec()')
            .end();
        const query = this.mongooseModel.remove(conditions);
        return query.exec();
    }
    async restore() {
        if (!this.softDelete) {
            return { n: 0, nModified: 0, ok: 1 };
        }
        const conditions = this.isNotUsedOrEmptyCondition();
        if (conditions === false) {
            return { n: 0, nModified: 0, ok: 1 };
        }
        const updateData = {
            $set: { [this.softDelete.deletedAt]: this.convention.getNullValueFor(this.softDelete.deletedAt) }
        };
        const query = this.mongooseModel.update(conditions, updateData, { multi: true });
        this.resolveMongodbQueryLog()
            .action('restore')
            .raw(this.mongooseModel.modelName)
            .raw('.update(', conditions, ',', updateData, ', ', { multi: true }, ')')
            .raw('.exec()')
            .end();
        return query.exec();
    }
    async execute() {
        const logger = this.resolveMongodbQueryLog();
        const query = this.getQuery(false, logger);
        logger
            .raw('.exec()')
            .action('execute')
            .end();
        return query.exec();
    }
    // -------------------------------------------------------------------------------------------------------------------
    getQuery(isFindOne = false, logger) {
        if (!this.hasMongooseQuery) {
            const conditions = this.resolveMongodbConditionConverter().convert();
            this.mongooseQuery = isFindOne
                ? this.mongooseModel.findOne(conditions)
                : (this.mongooseQuery = this.mongooseModel.find(conditions));
            if (logger) {
                logger.raw(this.mongooseModel.modelName).raw(isFindOne ? '.findOne(' : '.find(', conditions, ')');
            }
            this.hasMongooseQuery = true;
        }
        return this.mongooseQuery;
    }
    passFieldsToQuery(query, logger) {
        for (const name in this.fields) {
            if (!lodash_1.isEmpty(this.fields[name])) {
                const fields = this.fields[name].join(' ');
                query[name](fields);
                if (logger) {
                    logger.raw(`.${name}("${fields}")`);
                }
            }
        }
    }
    passLimitToQuery(query, logger) {
        if (this.limitNumber) {
            query.limit(this.limitNumber);
            if (logger) {
                logger.raw(`.limit(${this.limitNumber})`);
            }
        }
    }
    passOrderingToQuery(query, logger) {
        if (this.ordering && !lodash_1.isEmpty(this.ordering)) {
            const sort = Object.keys(this.ordering).reduce((memo, key) => {
                memo[key] = this.ordering[key] === 'asc' ? 1 : -1;
                return memo;
            }, {});
            query.sort(sort);
            if (logger) {
                logger.raw('.sort(', sort, ')');
            }
        }
    }
    passDataToMongooseQuery(query, logger) {
        this.passFieldsToQuery(query, logger);
        this.passLimitToQuery(query, logger);
        this.passOrderingToQuery(query, logger);
        return query;
    }
    createQuery(findOne, logger) {
        return this.passDataToMongooseQuery(this.getQuery(findOne, logger), logger);
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
MongooseQueryBuilder.className = constants_1.NajsEloquent.QueryBuilder.MongooseQueryBuilder;
exports.MongooseQueryBuilder = MongooseQueryBuilder;
najs_binding_1.register(MongooseQueryBuilder);
