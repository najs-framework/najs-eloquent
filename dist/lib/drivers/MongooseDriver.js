"use strict";
/// <reference path="../contracts/Driver.ts" />
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../model/interfaces/IModelSetting.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../wrappers/MongooseQueryBuilderWrapper");
require("../query-builders/mongodb/MongooseQueryBuilder");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const MongooseProviderFacade_1 = require("../facades/global/MongooseProviderFacade");
const SoftDelete_1 = require("./mongoose/SoftDelete");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const pluralize_1 = require("pluralize");
const setupTimestampMoment = require('mongoose-timestamps-moment').setupTimestamp;
class MongooseDriver {
    constructor(model) {
        this.modelName = model.getModelName();
        this.queryLogGroup = 'all';
        this.schema = model.getSettingProperty('schema', {});
        this.options = model.getSettingProperty('options', {});
        // we need softDeletesSetting to initialize softDeletes option in query builder
        if (model.hasSoftDeletes()) {
            this.softDeletesSetting = model.getSoftDeletesSetting();
        }
    }
    getClassName() {
        return constants_1.NajsEloquent.Driver.MongooseDriver;
    }
    initialize(model, isGuarded, data) {
        this.initializeModelIfNeeded(model);
        this.createAttributesByData(model, isGuarded, data);
    }
    initializeModelIfNeeded(model) {
        // prettier-ignore
        if (MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().modelNames().indexOf(this.modelName) !== -1) {
            return;
        }
        const schema = this.getMongooseSchema(model);
        if (model.hasTimestamps()) {
            schema.set('timestamps', model.getTimestampsSetting());
        }
        if (model.hasSoftDeletes()) {
            this.softDeletesSetting = model.getSoftDeletesSetting();
            schema.plugin(SoftDelete_1.SoftDelete, this.softDeletesSetting);
        }
        MongooseProviderFacade_1.MongooseProvider.createModelFromSchema(this.modelName, schema);
    }
    getMongooseSchema(model) {
        let schema = undefined;
        if (lodash_1.isFunction(model['getSchema'])) {
            schema = model['getSchema']();
            Object.getPrototypeOf(schema).setupTimestamp = setupTimestampMoment;
        }
        if (!schema || !(schema instanceof mongoose_1.Schema)) {
            mongoose_1.Schema.prototype['setupTimestamp'] = setupTimestampMoment;
            schema = new mongoose_1.Schema(this.schema, Object.assign({ collection: this.getCollectionName() }, this.options));
        }
        return schema;
    }
    createAttributesByData(model, isGuarded, data) {
        this.mongooseModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model(this.modelName);
        if (data instanceof this.mongooseModel) {
            this.attributes = data;
            return;
        }
        this.attributes = new this.mongooseModel();
        if (typeof data === 'object') {
            if (isGuarded) {
                model.fill(data);
            }
            else {
                this.attributes.set(data);
            }
        }
    }
    getCollectionName() {
        return pluralize_1.plural(lodash_1.snakeCase(this.modelName));
    }
    getRecordName() {
        return this.attributes ? this.attributes.collection.name : this.getCollectionName();
    }
    getRecord() {
        return this.attributes;
    }
    setRecord(value) {
        this.attributes = value;
    }
    useEloquentProxy() {
        return true;
    }
    shouldBeProxied(key) {
        if (key === 'schema' || key === 'options') {
            return false;
        }
        return true;
    }
    proxify(type, target, key, value) {
        if (type === 'get') {
            return this.getAttribute(key);
        }
        return this.setAttribute(key, value);
    }
    hasAttribute(name) {
        return typeof this.schema[name] !== 'undefined';
    }
    getAttribute(name) {
        return this.attributes.get(name);
    }
    setAttribute(name, value) {
        this.attributes.set(name, value);
        return true;
    }
    getPrimaryKeyName() {
        return '_id';
    }
    toObject() {
        return this.attributes.toObject({ virtuals: true });
    }
    newQuery() {
        return najs_binding_1.make(constants_1.NajsEloquent.Wrapper.MongooseQueryBuilderWrapper, [
            this.modelName,
            this.getRecordName(),
            najs_binding_1.make(constants_1.NajsEloquent.QueryBuilder.MongooseQueryBuilder, [this.modelName, this.softDeletesSetting])
        ]);
    }
    async delete(softDeletes) {
        if (softDeletes) {
            return this.attributes['delete']();
        }
        return this.attributes.remove();
    }
    async restore() {
        return this.attributes['restore']();
    }
    async save() {
        return this.attributes.save();
    }
    markModified(name) {
        this.attributes.markModified(name);
    }
    isNew() {
        return this.attributes.isNew;
    }
    isSoftDeleted() {
        if (this.softDeletesSetting) {
            return this.attributes.get(this.softDeletesSetting.deletedAt) !== null;
        }
        return false;
    }
    formatAttributeName(name) {
        return lodash_1.snakeCase(name);
    }
    getModelComponentName() {
        return undefined;
    }
    getModelComponentOrder(components) {
        return components;
    }
}
MongooseDriver.className = constants_1.NajsEloquent.Driver.MongooseDriver;
exports.MongooseDriver = MongooseDriver;
