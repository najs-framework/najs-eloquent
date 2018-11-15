"use strict";
/// <reference path="../definitions/utils/IClassSetting.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("./functions");
class SettingType {
    static arrayUnique(initializeValue, defaultValue) {
        return function (staticValue, sampleValue, instanceValue) {
            if (!staticValue && !sampleValue && !instanceValue) {
                return defaultValue;
            }
            const values = initializeValue
                .concat(staticValue ? staticValue : [])
                .concat(sampleValue ? sampleValue : [])
                .concat(instanceValue ? instanceValue : []);
            const result = functions_1.array_unique(values);
            if (result.length === 0) {
                return defaultValue;
            }
            return result;
        };
    }
}
exports.SettingType = SettingType;
