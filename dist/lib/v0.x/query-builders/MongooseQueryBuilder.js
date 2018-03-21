"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryLogFacade_1 = require("../../facades/global/QueryLogFacade");
const QueryBuilder_1 = require("./QueryBuilder");
const MongodbConditionConverter_1 = require("./MongodbConditionConverter");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const collect_js_1 = require("collect.js");
const NotFoundError_1 = require("../errors/NotFoundError");
class MongooseQueryBuilder extends QueryBuilder_1.QueryBuilder {
    constructor(modelName, softDelete, primaryKey = '_id') {
        super(softDelete);
        this.primaryKey = primaryKey;
        const mongoose = this.getMongooseProvider().getMongooseInstance();
        if (mongoose.modelNames().indexOf(modelName) === -1) {
            throw new Error('Model ' + modelName + ' Not Found');
        }
        this.mongooseModel = mongoose.model(modelName);
    }
    getMongooseProvider() {
        return najs_binding_1.make('MongooseProvider');
    }
    getQuery(isFindOne = false, rawLogs = []) {
        if (!this.hasMongooseQuery) {
            const conditions = new MongodbConditionConverter_1.MongodbConditionConverter(this.getConditions()).convert();
            rawLogs.push(this.mongooseModel.modelName);
            if (isFindOne) {
                this.mongooseQuery = this.mongooseModel.findOne(conditions);
                rawLogs.push(`.findOne(${JSON.stringify(conditions)})`);
            }
            else {
                this.mongooseQuery = this.mongooseModel.find(conditions);
                rawLogs.push(`.find(${JSON.stringify(conditions)})`);
            }
            this.hasMongooseQuery = true;
        }
        return this.mongooseQuery;
    }
    passDataToMongooseQuery(query, rawLogs = []) {
        if (!lodash_1.isEmpty(this.selectedFields)) {
            const selectParams = this.selectedFields.join(' ');
            query.select(selectParams);
            rawLogs.push(`.select("${selectParams}")`);
        }
        if (!lodash_1.isEmpty(this.distinctFields)) {
            const distinctParams = this.distinctFields.join(' ');
            query.distinct(distinctParams);
            rawLogs.push(`.distinct("${distinctParams}")`);
        }
        if (this.limitNumber) {
            query.limit(this.limitNumber);
            rawLogs.push(`.limit(${this.limitNumber})`);
        }
        if (this.ordering && !lodash_1.isEmpty(this.ordering)) {
            const sort = Object.keys(this.ordering).reduce((memo, key) => {
                memo[key] = this.ordering[key] === 'asc' ? 1 : -1;
                return memo;
            }, {});
            query.sort(sort);
            rawLogs.push(`.sort(${JSON.stringify(sort)})`);
        }
        return query;
    }
    getPrimaryKey() {
        return this.primaryKey;
    }
    native(handler) {
        this.mongooseQuery = handler.call(undefined, this.isUsed ? this.passDataToMongooseQuery(this.getQuery()) : this.mongooseModel);
        this.hasMongooseQuery = true;
        return this;
    }
    toObject() {
        const conditions = new MongodbConditionConverter_1.MongodbConditionConverter(this.getConditions()).convert();
        return {
            name: this.name ? this.name : undefined,
            select: !lodash_1.isEmpty(this.selectedFields) ? this.selectedFields : undefined,
            distinct: !lodash_1.isEmpty(this.distinctFields) ? this.distinctFields : undefined,
            limit: this.limitNumber,
            orderBy: !lodash_1.isEmpty(this.ordering) ? this.ordering : undefined,
            conditions: !lodash_1.isEmpty(conditions) ? conditions : undefined
        };
    }
    logQuery(action, raw) {
        const data = this.toObject();
        data['builder'] = MongooseQueryBuilder.className;
        data['action'] = action;
        data['raw'] = raw;
        QueryLogFacade_1.QueryLog.push(data, this.queryLogGroup);
    }
    getFieldByName(name) {
        if (name === 'id') {
            return '_id';
        }
        return name;
    }
    // -------------------------------------------------------------------------------------------------------------------
    async get() {
        const rawLogs = [];
        const query = this.passDataToMongooseQuery(this.getQuery(false, rawLogs), rawLogs);
        rawLogs.push('.exec()');
        this.logQuery('get', rawLogs.join(''));
        const result = await query.exec();
        if (result && !lodash_1.isEmpty(result)) {
            const eloquent = najs_binding_1.make(this.mongooseModel.modelName);
            return eloquent.newCollection(result);
        }
        return collect_js_1.default([]);
    }
    async all() {
        return this.get();
    }
    async find() {
        const rawLogs = [];
        const query = this.passDataToMongooseQuery(this.getQuery(true, rawLogs), rawLogs);
        // change mongoose query operator from find to findOne if needed
        if (query['op'] === 'find') {
            query.findOne();
            rawLogs.push('.fineOne()');
        }
        rawLogs.push('.exec()');
        this.logQuery('find', rawLogs.join(''));
        const result = await query.exec();
        if (result) {
            return najs_binding_1.make(this.mongooseModel.modelName).newInstance(result);
        }
        // tslint:disable-next-line
        return null;
    }
    async findOrFail() {
        const value = await this.find();
        if (!value) {
            throw new NotFoundError_1.NotFoundError(this.mongooseModel.modelName);
        }
        return value;
    }
    async firstOrFail() {
        return this.findOrFail();
    }
    async first() {
        return this.find();
    }
    async pluck(value, key) {
        const rawLogs = [];
        this.selectedFields = [];
        const keyName = key ? key : this.primaryKey;
        this.select(value, keyName);
        const query = this.passDataToMongooseQuery(this.getQuery(false, rawLogs), rawLogs);
        rawLogs.push('.exec()');
        this.logQuery('pluck', rawLogs.join(''));
        const result = await query.exec();
        if (result && !lodash_1.isEmpty(result)) {
            return result.reduce(function (memo, item) {
                memo[item[keyName]] = item[value];
                return memo;
            }, {});
        }
        return {};
    }
    async count() {
        const rawLogs = [];
        this.selectedFields = [];
        this.select(this.primaryKey);
        const query = this.passDataToMongooseQuery(this.getQuery(false, rawLogs), rawLogs);
        rawLogs.push('.count().exec()');
        this.logQuery('count', rawLogs.join(''));
        const result = await query.count().exec();
        return result;
    }
    async update(data) {
        const rawLogs = [];
        const conditions = new MongodbConditionConverter_1.MongodbConditionConverter(this.getConditions()).convert();
        const query = this.mongooseModel.update(conditions, data, {
            multi: true
        });
        rawLogs.push(this.mongooseModel.modelName);
        rawLogs.push(`.update(${JSON.stringify(conditions)}, ${JSON.stringify(data)}, {multi: true})`);
        rawLogs.push('.exec()');
        this.logQuery('update', rawLogs.join(''));
        return query.exec();
    }
    async delete() {
        const conditions = this.isNotUsedOrEmptyCondition();
        if (conditions === false) {
            return { n: 0, ok: 1 };
        }
        const rawLogs = [];
        rawLogs.push(this.mongooseModel.modelName);
        rawLogs.push(`.remove(${JSON.stringify(conditions)})`);
        rawLogs.push('.exec()');
        this.logQuery('delete', rawLogs.join(''));
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
        const rawLogs = [];
        const updateData = {
            $set: { [this.softDelete.deletedAt]: this.getNullValue(this.softDelete.deletedAt) }
        };
        const query = this.mongooseModel.update(conditions, updateData, { multi: true });
        rawLogs.push(this.mongooseModel.modelName);
        rawLogs.push('.update(');
        rawLogs.push(JSON.stringify(conditions));
        rawLogs.push(', ');
        rawLogs.push(JSON.stringify(updateData));
        rawLogs.push(', ');
        rawLogs.push(JSON.stringify({ multi: true }));
        rawLogs.push(').exec()');
        this.logQuery('restore', rawLogs.join(''));
        return query.exec();
    }
    async execute() {
        const rawLogs = [];
        const query = this.getQuery(false, rawLogs);
        rawLogs.push('.exec()');
        this.logQuery('execute', rawLogs.join(''));
        return query.exec();
    }
    isNotUsedOrEmptyCondition() {
        if (!this.isUsed) {
            return false;
        }
        const conditions = new MongodbConditionConverter_1.MongodbConditionConverter(this.getConditions()).convert();
        if (lodash_1.isEmpty(conditions)) {
            return false;
        }
        return conditions;
    }
}
MongooseQueryBuilder.className = 'MongooseQueryBuilder';
exports.MongooseQueryBuilder = MongooseQueryBuilder;
