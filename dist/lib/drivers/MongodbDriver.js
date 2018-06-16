"use strict";
/// <reference types="najs-event" />
/// <reference path="../contracts/Driver.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../wrappers/MongodbQueryBuilderWrapper");
require("../query-builders/mongodb/MongodbQueryBuilder");
const constants_1 = require("../constants");
const Record_1 = require("../model/Record");
const RecordDriverBase_1 = require("./RecordDriverBase");
const MongodbProviderFacade_1 = require("../facades/global/MongodbProviderFacade");
const najs_binding_1 = require("najs-binding");
const Moment = require("moment");
class MongodbDriver extends RecordDriverBase_1.RecordBaseDriver {
    getClassName() {
        return constants_1.NajsEloquent.Driver.MongodbDriver;
    }
    initialize(model, isGuarded, data) {
        this.collection = MongodbProviderFacade_1.MongodbProviderFacade.getDatabase().collection(this.formatRecordName());
        if (data instanceof Record_1.Record) {
            this.attributes = data;
            return;
        }
        if (typeof data === 'object') {
            if (isGuarded) {
                this.attributes = new Record_1.Record();
                model.fill(data);
            }
            else {
                this.attributes = new Record_1.Record(data);
            }
        }
        else {
            this.attributes = new Record_1.Record();
        }
    }
    getRecordName() {
        return this.collection.collectionName;
    }
    getPrimaryKeyName() {
        return '_id';
    }
    isNew() {
        return typeof this.attributes.getAttribute(this.getPrimaryKeyName()) === 'undefined';
    }
    newQuery(dataBucket) {
        return najs_binding_1.make(constants_1.NajsEloquent.Wrapper.MongodbQueryBuilderWrapper, [
            this.modelName,
            this.getRecordName(),
            najs_binding_1.make(constants_1.NajsEloquent.QueryBuilder.MongodbQueryBuilder, [
                this.modelName,
                this.collection,
                this.softDeletesSetting,
                this.getPrimaryKeyName()
            ]),
            dataBucket
        ]);
    }
    async delete(softDeletes) {
        if (softDeletes && this.softDeletesSetting) {
            this.setAttribute(this.softDeletesSetting.deletedAt, Moment().toDate());
            return this.save(false);
        }
        if (!this.isNew()) {
            const primaryKey = this.getPrimaryKeyName();
            return this.collection.deleteOne({ [primaryKey]: this.attributes.getAttribute(primaryKey) });
        }
    }
    async restore() {
        if (!this.isNew() && this.softDeletesSetting) {
            // tslint:disable-next-line
            this.setAttribute(this.softDeletesSetting.deletedAt, null);
            return this.save(false);
        }
    }
    async save(fillData = true) {
        if (fillData) {
            const isNew = this.isNew();
            if (this.timestampsSetting) {
                this.setAttribute(this.timestampsSetting.updatedAt, Moment().toDate());
                if (isNew) {
                    this.setAttributeIfNeeded(this.timestampsSetting.createdAt, Moment().toDate());
                }
            }
            if (this.softDeletesSetting) {
                // tslint:disable-next-line
                this.setAttributeIfNeeded(this.softDeletesSetting.deletedAt, null);
            }
        }
        return new Promise((resolve, reject) => {
            this.collection.save(this.attributes.toObject(), function (error, result) {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
    setAttributeIfNeeded(attribute, value) {
        if (typeof this.attributes.getAttribute(attribute) === 'undefined') {
            this.attributes.setAttribute(attribute, value);
        }
    }
    getModelComponentName() {
        return undefined;
    }
    getModelComponentOrder(components) {
        return components;
    }
}
exports.MongodbDriver = MongodbDriver;
