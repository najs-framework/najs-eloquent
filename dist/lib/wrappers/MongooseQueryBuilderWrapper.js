"use strict";
/// <reference path="../query-builders/interfaces/IFetchResultQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const QueryBuilderWrapper_1 = require("./QueryBuilderWrapper");
const constants_1 = require("../constants");
class MongooseQueryBuilderWrapper extends QueryBuilderWrapper_1.QueryBuilderWrapper {
    getClassName() {
        return constants_1.NajsEloquent.Wrapper.MongooseQueryBuilderWrapper;
    }
    /**
     * Create a mongoose native query
     * @param handler
     */
    native(handler) {
        return this.queryBuilder.native(handler);
    }
}
MongooseQueryBuilderWrapper.className = constants_1.NajsEloquent.Wrapper.MongooseQueryBuilderWrapper;
exports.MongooseQueryBuilderWrapper = MongooseQueryBuilderWrapper;
najs_binding_1.register(MongooseQueryBuilderWrapper);
