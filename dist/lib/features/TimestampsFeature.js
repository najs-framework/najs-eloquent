"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const FeatureBase_1 = require("./FeatureBase");
const TimestampsPublicApi_1 = require("./mixin/TimestampsPublicApi");
const constants_1 = require("../constants");
class TimestampsFeature extends FeatureBase_1.FeatureBase {
    getPublicApi() {
        return TimestampsPublicApi_1.TimestampsPublicApi;
    }
    getFeatureName() {
        return 'Timestamps';
    }
    getClassName() {
        return constants_1.NajsEloquent.Feature.TimestampsFeature;
    }
    hasTimestamps(model) {
        return this.useSettingFeatureOf(model).hasSetting(model, 'timestamps');
    }
    getTimestampsSetting(model) {
        return this.useSettingFeatureOf(model).getSettingWithDefaultForTrueValue(model, 'timestamps', TimestampsFeature.DefaultSetting);
    }
    touch(model) {
        if (this.hasTimestamps(model)) {
            model.markModified(this.getTimestampsSetting(model).updatedAt);
        }
    }
}
TimestampsFeature.DefaultSetting = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
exports.TimestampsFeature = TimestampsFeature;
najs_binding_1.register(TimestampsFeature, constants_1.NajsEloquent.Feature.TimestampsFeature);
