"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const pluralize_1 = require("pluralize");
const EloquentMetadata_1 = require("../model/EloquentMetadata");
const mongoose_1 = require("mongoose");
const MongooseQueryBuilder_1 = require("../query-builders/mongodb/MongooseQueryBuilder");
const MongooseProviderFacade_1 = require("../facades/global/MongooseProviderFacade");
const SoftDelete_1 = require("./mongoose/SoftDelete");
const setupTimestampMoment = require('mongoose-timestamps-moment').setupTimestamp;
const STATIC_METHODS_WITH_ID = ['first', 'firstOrFail', 'find', 'findOrFail', 'delete', 'restore'];
const QUERY_PROXY_METHODS_IBasicQuery = [
    'queryName',
    'select',
    'distinct',
    'orderBy',
    'orderByAsc',
    'orderByDesc',
    'limit'
];
const QUERY_PROXY_METHODS_IConditionQuery = [
    'where',
    'orWhere',
    'whereIn',
    'whereNotIn',
    'orWhereIn',
    'orWhereNotIn',
    'whereNull',
    'whereNotNull',
    'orWhereNull',
    'orWhereNotNull',
    'native'
];
const QUERY_PROXY_METHODS_ISoftDeletesQuery = ['withTrashed', 'onlyTrashed'];
const QUERY_PROXY_METHODS_MongooseQueryHelpers = ['findOrFail', 'firstOrFail'];
const QUERY_PROXY_METHODS_IFetchResultQuery = [
    // IFetchResultQuery
    'get',
    'all',
    'find',
    'first',
    'count',
    'pluck',
    'update'
    // 'delete', conflict to .getDriverProxyMethods() then it should be removed
    // 'restore', conflict to .getDriverProxyMethods() then it should be removed
    // 'execute', removed because it could not run alone
];
class MongooseDriver {
    constructor(model, isGuarded) {
        this.eloquentModel = model;
        this.modelName = model.getModelName();
        this.queryLogGroup = 'all';
        this.isGuarded = isGuarded;
    }
    getClassName() {
        return MongooseDriver.className;
    }
    initialize(data) {
        this.metadata = EloquentMetadata_1.EloquentMetadata.get(this.eloquentModel);
        this.initializeModelIfNeeded();
        this.createAttributesByData(data);
    }
    initializeModelIfNeeded() {
        // prettier-ignore
        if (MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().modelNames().indexOf(this.modelName) !== -1) {
            return;
        }
        const schema = this.getMongooseSchema();
        if (this.metadata.hasTimestamps()) {
            schema.set('timestamps', this.metadata.timestamps());
        }
        if (this.metadata.hasSoftDeletes()) {
            schema.plugin(SoftDelete_1.SoftDelete, this.metadata.softDeletes());
        }
        MongooseProviderFacade_1.MongooseProvider.createModelFromSchema(this.modelName, schema);
    }
    getMongooseSchema() {
        let schema = undefined;
        if (lodash_1.isFunction(this.eloquentModel['getSchema'])) {
            schema = this.eloquentModel['getSchema']();
            Object.getPrototypeOf(schema).setupTimestamp = setupTimestampMoment;
        }
        if (!schema || !(schema instanceof mongoose_1.Schema)) {
            mongoose_1.Schema.prototype['setupTimestamp'] = setupTimestampMoment;
            schema = new mongoose_1.Schema(this.metadata.getSettingProperty('schema', {}), Object.assign({ collection: pluralize_1.plural(lodash_1.snakeCase(this.modelName)) }, this.metadata.getSettingProperty('options', {})));
        }
        return schema;
    }
    createAttributesByData(data) {
        this.mongooseModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model(this.modelName);
        if (data instanceof this.mongooseModel) {
            this.attributes = data;
            return;
        }
        this.attributes = new this.mongooseModel();
        if (typeof data === 'object') {
            if (this.isGuarded) {
                this.eloquentModel.fill(data);
            }
            else {
                this.attributes.set(data);
            }
        }
    }
    getRecord() {
        return this.attributes;
    }
    getAttribute(name) {
        return this.attributes[name];
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
        return true;
    }
    getId() {
        return this.attributes._id;
    }
    setId(id) {
        this.attributes._id = id;
    }
    newQuery() {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.modelName, this.metadata.hasSoftDeletes() ? this.metadata.softDeletes() : undefined).setLogGroup(this.queryLogGroup);
    }
    toObject() {
        return this.attributes.toObject();
    }
    toJSON() {
        const data = this.toObject();
        return Object.getOwnPropertyNames(data).reduce((memo, name) => {
            const key = name === '_id' ? 'id' : name;
            if (this.eloquentModel.isVisible(key)) {
                memo[key] = data[name];
            }
            return memo;
        }, {});
    }
    is(model) {
        return this.attributes['_id'].toString() === model['getId']().toString();
    }
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
    }
    getReservedNames() {
        return ['schema', 'collection', 'options', 'getSchema'];
    }
    getDriverProxyMethods() {
        return [
            'is',
            'toObject',
            'toJSON',
            'getId',
            'setId',
            'newQuery',
            'touch',
            'save',
            'delete',
            'forceDelete',
            'restore',
            'fresh'
        ];
    }
    getQueryProxyMethods() {
        return QUERY_PROXY_METHODS_IBasicQuery.concat(QUERY_PROXY_METHODS_IConditionQuery, QUERY_PROXY_METHODS_ISoftDeletesQuery, QUERY_PROXY_METHODS_MongooseQueryHelpers, QUERY_PROXY_METHODS_IFetchResultQuery);
    }
    createStaticMethods(eloquent) {
        this.getQueryProxyMethods()
            .concat(['delete', 'restore'])
            .forEach(function (method) {
            if (!!eloquent[method]) {
                return;
            }
            if (STATIC_METHODS_WITH_ID.indexOf(method) !== -1) {
                eloquent[method] = function () {
                    const query = Reflect.construct(eloquent, []).newQuery();
                    if (arguments.length === 1) {
                        query.where('id', arguments[0]);
                    }
                    return query[method]();
                };
            }
            else {
                eloquent[method] = function () {
                    const query = Reflect.construct(eloquent, []).newQuery();
                    return query[method](...arguments);
                };
            }
        });
    }
    touch() {
        if (this.metadata.hasTimestamps()) {
            const opts = this.metadata.timestamps();
            this.attributes.markModified(opts.updatedAt);
        }
        return this.eloquentModel;
    }
    async save() {
        return this.attributes.save();
    }
    async delete() {
        if (this.metadata.hasSoftDeletes()) {
            return this.attributes['delete']();
        }
        return this.attributes.remove();
    }
    async forceDelete() {
        return this.attributes.remove();
    }
    async restore() {
        if (this.metadata.hasSoftDeletes()) {
            return this.attributes['restore']();
        }
    }
    async fresh() {
        if (this.attributes.isNew) {
            // tslint:disable-next-line
            return null;
        }
        const query = this.newQuery();
        return query.where(query.getPrimaryKey(), this.attributes._id).first();
    }
}
MongooseDriver.className = 'NajsEloquent.MongooseDriver';
exports.MongooseDriver = MongooseDriver;
