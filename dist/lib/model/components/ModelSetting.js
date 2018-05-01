"use strict";
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const SettingType_1 = require("../../util/SettingType");
const ClassSetting_1 = require("../../util/ClassSetting");
const constants_1 = require("../../constants");
const functions_1 = require("../../util/functions");
const lodash_1 = require("lodash");
const najs_binding_1 = require("najs-binding");
class ModelSetting {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelSetting;
    }
    extend(prototype, bases, driver) {
        prototype['getClassSetting'] = ModelSetting.getClassSetting;
        prototype['getSettingProperty'] = ModelSetting.getSettingProperty;
        prototype['hasSetting'] = ModelSetting.hasSetting;
        prototype['getSettingWithDefaultForTrueValue'] = ModelSetting.getSettingWithDefaultForTrueValue;
        prototype['getArrayUniqueSetting'] = ModelSetting.getArrayUniqueSetting;
        prototype['pushToUniqueArraySetting'] = ModelSetting.pushToUniqueArraySetting;
        prototype['isInWhiteList'] = ModelSetting.isInWhiteList;
        prototype['isKeyInWhiteList'] = ModelSetting.isKeyInWhiteList;
        prototype['isInBlackList'] = ModelSetting.isInBlackList;
        prototype['isKeyInBlackList'] = ModelSetting.isKeyInBlackList;
    }
}
ModelSetting.className = constants_1.NajsEloquent.Model.Component.ModelSetting;
ModelSetting.getSettingProperty = function (property, defaultValue) {
    return this.getClassSetting().read(property, function (staticVersion, sampleVersion) {
        if (staticVersion) {
            return staticVersion;
        }
        return sampleVersion ? sampleVersion : defaultValue;
    });
};
ModelSetting.hasSetting = function (property) {
    return !!this.getSettingProperty(property, false);
};
ModelSetting.getSettingWithDefaultForTrueValue = function (property, defaultValue) {
    const value = this.getSettingProperty(property, false);
    if (value === true) {
        return defaultValue;
    }
    return value || defaultValue;
};
ModelSetting.getClassSetting = function () {
    if (!this.settings) {
        this.settings = ClassSetting_1.ClassSetting.of(this);
    }
    return this.settings;
};
ModelSetting.getArrayUniqueSetting = function (property, defaultValue) {
    return this.getClassSetting().read(property, SettingType_1.SettingType.arrayUnique([], defaultValue));
};
ModelSetting.pushToUniqueArraySetting = function (property, args) {
    const setting = this[property] || [];
    this[property] = functions_1.array_unique(setting, lodash_1.flatten(args));
    return this;
};
ModelSetting.isInWhiteList = function (list, whiteList, blackList) {
    const keys = lodash_1.flatten(list);
    for (const key of keys) {
        if (!this.isKeyInWhiteList(key, whiteList, blackList)) {
            return false;
        }
    }
    return true;
};
ModelSetting.isKeyInWhiteList = function (key, whiteList, blackList) {
    if (whiteList.length > 0 && whiteList.indexOf(key) !== -1) {
        return true;
    }
    if (this.isKeyInBlackList(key, blackList)) {
        return false;
    }
    return whiteList.length === 0 && this['knownAttributes'].indexOf(key) === -1 && key.indexOf('_') !== 0;
};
ModelSetting.isInBlackList = function (list, blackList) {
    if (blackList.length === 1 && blackList[0] === '*') {
        return true;
    }
    const keys = lodash_1.flatten(list);
    for (const key of keys) {
        if (blackList.indexOf(key) === -1) {
            return false;
        }
    }
    return true;
};
ModelSetting.isKeyInBlackList = function (key, blackList) {
    return (blackList.length === 1 && blackList[0] === '*') || blackList.indexOf(key) !== -1;
};
exports.ModelSetting = ModelSetting;
najs_binding_1.register(ModelSetting);
