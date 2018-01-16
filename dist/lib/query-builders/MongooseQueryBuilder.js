"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueryBuilder_1 = require("./QueryBuilder");
const MongodbConditionConverter_1 = require("./MongodbConditionConverter");
const najs_1 = require("najs");
const lodash_1 = require("lodash");
const collect_js_1 = require("collect.js");
const NotFoundError_1 = require("../errors/NotFoundError");
class MongooseQueryBuilder extends QueryBuilder_1.QueryBuilder {
    constructor(modelName, softDelete, primaryKey = '_id') {
        super(softDelete);
        this.primaryKey = primaryKey;
        const mongoose = this.getMongoose();
        if (mongoose.modelNames().indexOf(modelName) === -1) {
            throw new Error('Model ' + modelName + ' Not Found');
        }
        this.mongooseModel = mongoose.model(modelName);
    }
    getMongoose() {
        return najs_1.make('MongooseProvider').getMongooseInstance();
    }
    getQuery(isFindOne = false) {
        if (!this.hasMongooseQuery) {
            const conditions = new MongodbConditionConverter_1.MongodbConditionConverter(this.getConditions()).convert();
            this.mongooseQuery = isFindOne ? this.mongooseModel.findOne(conditions) : this.mongooseModel.find(conditions);
            this.hasMongooseQuery = true;
        }
        return this.mongooseQuery;
    }
    passDataToMongooseQuery(query) {
        if (!lodash_1.isEmpty(this.selectedFields)) {
            query.select(this.selectedFields.join(' '));
        }
        if (!lodash_1.isEmpty(this.distinctFields)) {
            query.distinct(this.distinctFields.join(' '));
        }
        if (this.limitNumber) {
            query.limit(this.limitNumber);
        }
        if (this.ordering && !lodash_1.isEmpty(this.ordering)) {
            const sort = Object.keys(this.ordering).reduce((memo, key) => {
                memo[key] = this.ordering[key] === 'asc' ? 1 : -1;
                return memo;
            }, {});
            query.sort(sort);
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
    getFieldByName(name) {
        if (name === 'id') {
            return '_id';
        }
        return name;
    }
    // -------------------------------------------------------------------------------------------------------------------
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.passDataToMongooseQuery(this.getQuery());
            const result = yield query.exec();
            if (result && !lodash_1.isEmpty(result)) {
                const eloquent = najs_1.make(this.mongooseModel.modelName);
                return eloquent.newCollection(result);
            }
            return collect_js_1.default([]);
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get();
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.passDataToMongooseQuery(this.getQuery(true));
            // change mongoose query operator from find to findOne if needed
            if (query['op'] === 'find') {
                query.findOne();
            }
            const result = yield query.exec();
            if (result) {
                return najs_1.make(this.mongooseModel.modelName).newInstance(result);
            }
            // tslint:disable-next-line
            return null;
        });
    }
    findOrFail() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.find();
            if (!value) {
                throw new NotFoundError_1.NotFoundError(this.mongooseModel.modelName);
            }
            return value;
        });
    }
    firstOrFail() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOrFail();
        });
    }
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find();
        });
    }
    pluck(value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.selectedFields = [];
            const keyName = key ? key : this.primaryKey;
            this.select(value, keyName);
            const query = this.passDataToMongooseQuery(this.getQuery());
            const result = yield query.exec();
            if (result && !lodash_1.isEmpty(result)) {
                return result.reduce(function (memo, item) {
                    memo[item[keyName]] = item[value];
                    return memo;
                }, {});
            }
            return {};
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            this.selectedFields = [];
            this.select(this.primaryKey);
            const query = this.passDataToMongooseQuery(this.getQuery());
            const result = yield query.count().exec();
            return result;
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = new MongodbConditionConverter_1.MongodbConditionConverter(this.getConditions()).convert();
            const query = this.mongooseModel.update(conditions, data, {
                multi: true
            });
            return query.exec();
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = this.isNotUsedOrEmptyCondition();
            if (conditions === false) {
                return { n: 0, ok: 1 };
            }
            const query = this.mongooseModel.remove(conditions);
            return query.exec();
        });
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.softDelete) {
                return { n: 0, nModified: 0, ok: 1 };
            }
            const conditions = this.isNotUsedOrEmptyCondition();
            if (conditions === false) {
                return { n: 0, nModified: 0, ok: 1 };
            }
            const query = this.mongooseModel.update(conditions, {
                $set: { [this.softDelete.deletedAt]: this.getNullValue(this.softDelete.deletedAt) }
            }, { multi: true });
            return query.exec();
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getQuery().exec();
        });
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
exports.MongooseQueryBuilder = MongooseQueryBuilder;
