"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const pluralize_1 = require("pluralize");
const EloquentMetadata_1 = require("../model/EloquentMetadata");
const mongoose_1 = require("mongoose");
const MongooseQueryBuilder_1 = require("../query-builders/mongodb/MongooseQueryBuilder");
const MongooseProviderFacade_1 = require("../facades/global/MongooseProviderFacade");
// import { SoftDelete } from '../v0.x/eloquent/mongoose/SoftDelete'
class MongooseDriver {
    constructor(model, isGuarded) {
        this.eloquentModel = model;
        this.modelName = model.getModelName();
        this.queryLogGroup = 'all';
        this.isGuarded = isGuarded;
    }
    getClassName() {
        return 'NajsEloquent.MongooseDriver';
    }
    initialize(data) {
        this.metadata = EloquentMetadata_1.EloquentMetadata.get(this.eloquentModel);
        this.initializeModelIfNeeded();
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
    initializeModelIfNeeded() {
        // prettier-ignore
        if (MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().modelNames().indexOf(this.modelName) !== -1) {
            return;
        }
        const schema = new mongoose_1.Schema(this.metadata.getSettingProperty('schema', {}), this.metadata.getSettingProperty('options', { collection: pluralize_1.plural(lodash_1.snakeCase(this.modelName)) }));
        // timestamps
        // if (this.metadata.hasTimestamps()) {
        //   schema.set('timestamps', this.metadata.timestamps())
        // }
        // soft-deletes
        // if (this.metadata.hasSoftDeletes()) {
        //   schema.plugin(SoftDelete, this.metadata.softDeletes())
        // }
        MongooseProviderFacade_1.MongooseProvider.createModelFromSchema(this.modelName, schema);
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
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.modelName, undefined
        // this.metadata.hasSoftDeletes() ? this.metadata.softDeletes() : undefined
        ).setLogGroup(this.queryLogGroup);
    }
    // TODO: implementation
    toObject() {
        return this.attributes;
    }
    // TODO: implementation
    toJSON() {
        return this.attributes;
    }
    is(model) {
        return this.attributes['_id'] === model['getId']();
    }
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
    }
    getReservedNames() {
        return ['schema', 'collection', 'options'];
    }
    getDriverProxyMethods() {
        return ['is', 'getId', 'setId', 'newQuery', 'touch', 'save', 'delete', 'forceDelete', 'restore', 'fresh'];
    }
    getQueryProxyMethods() {
        return [
            // IBasicQuery
            'queryName',
            'select',
            'distinct',
            'orderBy',
            'orderByAsc',
            'orderByDesc',
            'limit',
            // IConditionQuery
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
            // IFetchResultQuery
            'get',
            'all',
            'find',
            'first',
            'count',
            'pluck',
            'update',
            // 'delete', conflict to .getDriverProxyMethods() then it should be removed
            // 'restore', conflict to .getDriverProxyMethods() then it should be removed
            'execute'
        ];
    }
    touch() {
        if (this.metadata.hasTimestamps()) {
            const opts = this.metadata.timestamps();
            this.attributes.markModified(opts.updatedAt);
        }
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
exports.MongooseDriver = MongooseDriver;
