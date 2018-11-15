"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const ModelEvent_1 = require("../model/ModelEvent");
const najs_binding_1 = require("najs-binding");
const FeatureBase_1 = require("./FeatureBase");
const SoftDeletesPublicApi_1 = require("./mixin/SoftDeletesPublicApi");
const constants_1 = require("../constants");
class SoftDeletesFeature extends FeatureBase_1.FeatureBase {
    getPublicApi() {
        return SoftDeletesPublicApi_1.SoftDeletesPublicApi;
    }
    getFeatureName() {
        return 'SoftDeletes';
    }
    getClassName() {
        return constants_1.NajsEloquent.Feature.SoftDeletesFeature;
    }
    hasSoftDeletes(model) {
        return this.useSettingFeatureOf(model).hasSetting(model, 'softDeletes');
    }
    getSoftDeletesSetting(model) {
        return this.useSettingFeatureOf(model).getSettingWithDefaultForTrueValue(model, 'softDeletes', SoftDeletesFeature.DefaultSetting);
    }
    trashed(model) {
        if (!this.hasSoftDeletes(model)) {
            return false;
        }
        return model.getAttribute(this.getSoftDeletesSetting(model).deletedAt) !== null;
    }
    async forceDelete(model) {
        await model.fire(ModelEvent_1.ModelEvent.Deleting);
        const result = await this.useRecordManagerOf(model)
            .getRecordExecutor(model)
            .hardDelete();
        await model.fire(ModelEvent_1.ModelEvent.Deleted);
        return result !== false;
    }
    async restore(model) {
        if (this.hasSoftDeletes(model) && !model.isNew()) {
            await model.fire(ModelEvent_1.ModelEvent.Restoring);
            const result = await this.useRecordManagerOf(model)
                .getRecordExecutor(model)
                .restore();
            await model.fire(ModelEvent_1.ModelEvent.Restored);
            return result !== false;
        }
        return false;
    }
}
SoftDeletesFeature.DefaultSetting = {
    deletedAt: 'deleted_at',
    overrideMethods: false
};
exports.SoftDeletesFeature = SoftDeletesFeature;
najs_binding_1.register(SoftDeletesFeature, constants_1.NajsEloquent.Feature.SoftDeletesFeature);
