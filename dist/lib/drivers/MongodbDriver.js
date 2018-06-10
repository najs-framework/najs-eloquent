"use strict";
/// <reference types="najs-event" />
/// <reference path="../contracts/Driver.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const Record_1 = require("../model/Record");
const RecordDriverBase_1 = require("./RecordDriverBase");
const MongodbProviderFacade_1 = require("../facades/global/MongodbProviderFacade");
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
    getModelComponentName() {
        return undefined;
    }
    getModelComponentOrder(components) {
        return components;
    }
    newQuery(dataBucket) {
        return {};
        // return make<NajsEloquent.Wrapper.IQueryBuilderWrapper<T>>(NajsEloquent.Wrapper.MongooseQueryBuilderWrapper, [
        //   this.modelName,
        //   this.getRecordName(),
        //   make(NajsEloquent.QueryBuilder.MongooseQueryBuilder, [this.modelName, this.softDeletesSetting]),
        //   dataBucket
        // ])
    }
    async delete(softDeletes) { }
    async restore() {
        // if (this.softDeletesSetting) {
        //   return new Promise((resolve, reject) => {
        //     this.collection.update
        //   })
        // }
        // return false
    }
    async save() {
        const isNew = this.isNew();
        if (this.timestampsSetting) {
            this.setAttribute(this.timestampsSetting.updatedAt, Moment().toDate());
            if (isNew) {
                this.setAttribute(this.timestampsSetting.createdAt, Moment().toDate());
            }
        }
        return new Promise((resolve, reject) => {
            this.collection.save(this.attributes, function (error, result) {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}
exports.MongodbDriver = MongodbDriver;
