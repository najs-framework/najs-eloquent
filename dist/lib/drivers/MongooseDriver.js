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
const DriverBase_1 = require("./based/DriverBase");
const setupTimestampMoment = require('mongoose-timestamps-moment').setupTimestamp;
class MongooseDriver extends DriverBase_1.DriverBase {
    constructor(model) {
        super();
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
            schema = new mongoose_1.Schema(this.schema, Object.assign({ collection: this.formatRecordName() }, this.options));
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
    getRecordName() {
        return this.attributes ? this.attributes.collection.name : this.formatRecordName();
    }
    shouldBeProxied(key) {
        if (key === 'schema' || key === 'options') {
            return false;
        }
        return true;
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
    newQuery(dataBucket) {
        return najs_binding_1.make(constants_1.NajsEloquent.Wrapper.MongooseQueryBuilderWrapper, [
            this.modelName,
            this.getRecordName(),
            najs_binding_1.make(constants_1.NajsEloquent.QueryBuilder.MongooseQueryBuilder, [this.modelName, this.softDeletesSetting]),
            dataBucket
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
    isModified(name) {
        return this.attributes.isModified(name);
    }
    getModified() {
        return this.attributes.modifiedPaths();
    }
    isNew() {
        return this.attributes.isNew;
    }
}
MongooseDriver.className = constants_1.NajsEloquent.Driver.MongooseDriver;
exports.MongooseDriver = MongooseDriver;
