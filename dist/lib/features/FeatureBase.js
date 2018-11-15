"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ISettingFeature.ts" />
/// <reference path="../definitions/features/IRecordManager.ts" />
/// <reference path="../definitions/features/IRecordManager.ts" />
/// <reference path="../definitions/features/ISerializationFeature.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.ts" />
/// <reference path="../definitions/features/IRelationFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class FeatureBase {
    attachPublicApi(prototype, bases, driver) {
        const publicApi = this.getPublicApi();
        if (publicApi) {
            Object.assign(prototype, publicApi);
        }
    }
    useInternalOf(model) {
        return model;
    }
    useSettingFeatureOf(model) {
        return model.getDriver().getSettingFeature();
    }
    useRecordManagerOf(model) {
        return model.getDriver().getRecordManager();
    }
    useFillableFeatureOf(model) {
        return model.getDriver().getFillableFeature();
    }
    useSerializationFeatureOf(model) {
        return model.getDriver().getSerializationFeature();
    }
    useTimestampsFeatureOf(model) {
        return model.getDriver().getTimestampsFeature();
    }
    useSoftDeletesFeatureOf(model) {
        return model.getDriver().getSoftDeletesFeature();
    }
    useRelationFeatureOf(model) {
        return model.getDriver().getRelationFeature();
    }
}
exports.FeatureBase = FeatureBase;
