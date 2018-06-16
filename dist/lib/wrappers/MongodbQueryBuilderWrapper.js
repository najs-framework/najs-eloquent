"use strict";
/// <reference path="../query-builders/interfaces/IFetchResultQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const QueryBuilderWrapper_1 = require("./QueryBuilderWrapper");
const constants_1 = require("../constants");
class MongodbQueryBuilderWrapper extends QueryBuilderWrapper_1.QueryBuilderWrapper {
    getClassName() {
        return constants_1.NajsEloquent.Wrapper.MongodbQueryBuilderWrapper;
    }
    /**
     * Create a mongoose native query
     * @param handler
     */
    native(handler) {
        return this.queryBuilder.native(handler);
    }
}
MongodbQueryBuilderWrapper.className = constants_1.NajsEloquent.Wrapper.MongodbQueryBuilderWrapper;
exports.MongodbQueryBuilderWrapper = MongodbQueryBuilderWrapper;
najs_binding_1.register(MongodbQueryBuilderWrapper, constants_1.NajsEloquent.Wrapper.MongodbQueryBuilderWrapper);
