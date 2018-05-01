"use strict";
/// <reference path="./interfaces/ISettingReader.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
exports.CREATE_SAMPLE = 'create-sample';
class ClassSetting {
    constructor(sample) {
        if (sample) {
            this.sample = sample;
            this.definition = Object.getPrototypeOf(sample).constructor;
        }
    }
    read(property, reader) {
        return reader(this.definition[property] ? this.definition[property] : undefined, this.sample[property] ? this.sample[property] : undefined, this.instance[property] ? this.instance[property] : undefined);
    }
    clone(instance) {
        const replicated = new ClassSetting();
        replicated.sample = this.sample;
        replicated.definition = this.definition;
        replicated.instance = instance;
        return replicated;
    }
    static of(instance, cache = true) {
        const className = najs_binding_1.getClassName(instance);
        if (!this.samples[className] || !cache) {
            this.samples[className] = new ClassSetting(najs_binding_1.make(className, [exports.CREATE_SAMPLE]));
        }
        return this.samples[className].clone(instance);
    }
}
/**
 * store ClassSetting instance with "sample"
 */
ClassSetting.samples = {};
exports.ClassSetting = ClassSetting;
