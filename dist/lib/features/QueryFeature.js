"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilderFactory.ts" />
/// <reference path="../definitions/features/IQueryFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const FeatureBase_1 = require("./FeatureBase");
const constants_1 = require("../constants");
class QueryFeature extends FeatureBase_1.FeatureBase {
    constructor(factory) {
        super();
        this.factory = factory;
    }
    getPublicApi() {
        return undefined;
    }
    getFeatureName() {
        return 'Query';
    }
    getClassName() {
        return constants_1.NajsEloquent.Feature.QueryFeature;
    }
    newQuery(model) {
        const queryBuilder = this.factory.make(model);
        const executeMode = this.useSettingFeatureOf(model).getSettingProperty(model, 'executeMode', 'default');
        if (executeMode !== 'default') {
            queryBuilder.handler.getQueryExecutor().setExecuteMode(executeMode);
        }
        return queryBuilder;
    }
}
exports.QueryFeature = QueryFeature;
najs_binding_1.register(QueryFeature, constants_1.NajsEloquent.Feature.QueryFeature);
