"use strict";
/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const MongodbQueryBuilderBase_1 = require("./MongodbQueryBuilderBase");
const constants_1 = require("../../constants");
class MongodbQueryBuilder extends MongodbQueryBuilderBase_1.MongodbQueryBuilderBase {
    constructor(modelName, collection, softDelete, primaryKey = '_id') {
        super(softDelete);
        this.modelName = modelName;
        this.collection = collection;
        this.primaryKey = primaryKey;
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryBuilder.MongodbQueryBuilder;
    }
    get() {
        throw new Error('Not implemented.');
    }
    first() {
        throw new Error('Not implemented.');
    }
    count() {
        throw new Error('Not implemented.');
    }
    update(data) {
        throw new Error('Not implemented.');
    }
    delete() {
        throw new Error('Not implemented.');
    }
    restore() {
        throw new Error('Not implemented.');
    }
    execute() {
        throw new Error('Not implemented.');
    }
}
exports.MongodbQueryBuilder = MongodbQueryBuilder;
najs_binding_1.register(MongodbQueryBuilder, constants_1.NajsEloquent.QueryBuilder.MongodbQueryBuilder);
