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
    static get(instance, cache = true) {
        const className = najs_binding_1.getClassName(instance);
        if (!this.samples[className] || !cache) {
            const sample = najs_binding_1.make(className, [exports.CREATE_SAMPLE]);
            sample['__sample'] = true;
            this.samples[className] = new ClassSetting(sample);
            this.samples[className];
        }
        return this.samples[className];
    }
    static of(instance, cache = true) {
        return this.get(instance, cache).clone(instance);
    }
}
/**
 * store ClassSetting instance with "sample"
 */
ClassSetting.samples = {};
exports.ClassSetting = ClassSetting;
