"use strict";
/// <reference path="../definitions/utils/IClassSetting.ts" />
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
    /**
     * Read the setting with given property and the setting reader callback.
     *
     * @param {string} property
     * @param {Function} reader
     */
    read(property, reader) {
        return reader(typeof this.definition[property] !== 'undefined' ? this.definition[property] : undefined, typeof this.sample[property] !== 'undefined' ? this.sample[property] : undefined, typeof this.instance[property] !== 'undefined' ? this.instance[property] : undefined);
    }
    /**
     * Get the "sample" instance.
     */
    getSample() {
        return this.sample;
    }
    /**
     * Get definition of the class.
     */
    getDefinition() {
        return this.definition;
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
