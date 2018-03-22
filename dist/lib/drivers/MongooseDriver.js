"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const EloquentMetadata_1 = require("../model/EloquentMetadata");
const MongooseQueryBuilder_1 = require("../query-builders/mongodb/MongooseQueryBuilder");
class MongooseDriver {
    constructor(model) {
        this.metadata = EloquentMetadata_1.EloquentMetadata.get(model);
        this.queryLogGroup = 'all';
    }
    getClassName() {
        return 'NajsEloquent.MongooseProvider';
    }
    initialize(data) {
        // this.attributes = data || {}
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
    // TODO: implementation
    newQuery() {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.modelName, this.metadata.hasSoftDeletes() ? this.metadata.softDeletes() : undefined).setLogGroup(this.queryLogGroup);
    }
    // TODO: implementation
    toObject() {
        return this.attributes;
    }
    // TODO: implementation
    toJSON() {
        return this.attributes;
    }
    // TODO: implementation
    is(model) {
        return this.attributes['id'] === model['driver']['attributes']['id'];
    }
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
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
    getReservedNames() {
        return ['schema', 'collection', 'schemaOptions'];
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
}
exports.MongooseDriver = MongooseDriver;
