"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const DEFAULT_TIMESTAMPS = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
class ModelTimestamps {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelTimestamps;
    }
    extend(prototype, bases, driver) {
        prototype['touch'] = ModelTimestamps.touch;
        prototype['hasTimestamps'] = ModelTimestamps.hasTimestamps;
        prototype['getTimestampsSetting'] = ModelTimestamps.getTimestampsSetting;
    }
    static touch() {
        if (this.hasTimestamps()) {
            this['driver'].markModified(this.getTimestampsSetting().updatedAt);
        }
        return this;
    }
    static get DefaultSetting() {
        return DEFAULT_TIMESTAMPS;
    }
}
ModelTimestamps.className = constants_1.NajsEloquent.Model.Component.ModelTimestamps;
ModelTimestamps.hasTimestamps = function () {
    return this.hasSetting('timestamps');
};
ModelTimestamps.getTimestampsSetting = function () {
    return this.getSettingWithDefaultForTrueValue('timestamps', DEFAULT_TIMESTAMPS);
};
exports.ModelTimestamps = ModelTimestamps;
najs_binding_1.register(ModelTimestamps);
