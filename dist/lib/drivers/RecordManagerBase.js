"use strict";
/// <reference path="../contracts/Driver.ts" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IRecordManager.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const functions_1 = require("../util/functions");
const lodash_2 = require("lodash");
const pluralize_1 = require("pluralize");
const RecordManagerPublicApi_1 = require("../features/mixin/RecordManagerPublicApi");
/**
 * Base class of all RecordManager, handling:
 *   - getKnownAttributes() and getDynamicAttributes() accessors
 *   - finding accessors/mutators and getters/setters of model
 */
class RecordManagerBase {
    constructor(executorFactory) {
        this.executorFactory = executorFactory;
    }
    getRecordExecutor(model) {
        const executor = this.executorFactory.makeRecordExecutor(model, model.attributes);
        const executeMode = model.driver.getSettingFeature().getSettingProperty(model, 'executeMode', 'default');
        if (executeMode !== 'default') {
            executor.setExecuteMode(executeMode);
        }
        return executor;
    }
    getFeatureName() {
        return 'RecordManager';
    }
    getRecordName(model) {
        return lodash_2.snakeCase(pluralize_1.plural(model.getModelName()));
    }
    getRecord(model) {
        return model.attributes;
    }
    formatAttributeName(model, name) {
        return lodash_2.snakeCase(name);
    }
    getPrimaryKey(model) {
        return this.getAttribute(model, this.getPrimaryKeyName(model));
    }
    setPrimaryKey(model, value) {
        return this.setAttribute(model, this.getPrimaryKeyName(model), value);
    }
    getKnownAttributes(model) {
        return model['sharedMetadata']['knownAttributes'];
    }
    getDynamicAttributes(model) {
        return model['sharedMetadata']['dynamicAttributes'];
    }
    attachPublicApi(prototype, bases, driver) {
        Object.assign(prototype, RecordManagerPublicApi_1.RecordManagerPublicApi);
        const knownAttributes = this.buildKnownAttributes(prototype, bases);
        const dynamicAttributes = this.buildDynamicAttributes(prototype, bases);
        Object.defineProperties(prototype['sharedMetadata'], {
            knownAttributes: {
                value: knownAttributes,
                writable: false,
                configurable: true
            },
            dynamicAttributes: {
                value: dynamicAttributes,
                writable: false,
                configurable: true
            }
        });
        this.bindAccessorsAndMutators(prototype, dynamicAttributes);
    }
    buildKnownAttributes(prototype, bases) {
        return functions_1.array_unique(['__sample'], ['sharedMetadata', 'internalData', 'attributes', 'driver', 'primaryKey'], ['executeMode'], ['fillable', 'guarded'], ['visible', 'hidden'], ['schema', 'options'], ['timestamps'], ['softDeletes'], ['pivot'], Object.getOwnPropertyNames(prototype), ...bases.map(base => Object.getOwnPropertyNames(base)));
    }
    buildDynamicAttributes(prototype, bases) {
        const bucket = {};
        this.findGettersAndSetters(bucket, prototype);
        this.findAccessorsAndMutators(bucket, prototype);
        bases.forEach(basePrototype => {
            this.findGettersAndSetters(bucket, basePrototype);
            this.findAccessorsAndMutators(bucket, basePrototype);
        });
        return bucket;
    }
    findGettersAndSetters(dynamicAttributes, prototype) {
        const descriptors = Object.getOwnPropertyDescriptors(prototype);
        for (const property in descriptors) {
            if (property === '__proto__') {
                continue;
            }
            const getter = lodash_1.isFunction(descriptors[property].get);
            const setter = lodash_1.isFunction(descriptors[property].set);
            if (!getter && !setter) {
                continue;
            }
            this.createDynamicAttributeIfNeeded(dynamicAttributes, property);
            dynamicAttributes[property].getter = getter;
            dynamicAttributes[property].setter = setter;
        }
    }
    findAccessorsAndMutators(bucket, prototype) {
        const names = Object.getOwnPropertyNames(prototype);
        const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g');
        names.forEach(name => {
            let match;
            while ((match = regex.exec(name)) != undefined) {
                // javascript RegExp has a bug when the match has length 0
                // if (match.index === regex.lastIndex) {
                //   ++regex.lastIndex
                // }
                const property = this.formatAttributeName(prototype, match[2]);
                this.createDynamicAttributeIfNeeded(bucket, property);
                if (match[1] === 'get') {
                    bucket[property].accessor = match[0];
                }
                else {
                    bucket[property].mutator = match[0];
                }
            }
        });
    }
    createDynamicAttributeIfNeeded(bucket, property) {
        if (!bucket[property]) {
            bucket[property] = {
                name: property,
                getter: false,
                setter: false
            };
        }
    }
    bindAccessorsAndMutators(prototype, dynamicAttributeSettings) {
        for (const name in dynamicAttributeSettings) {
            const descriptor = this.makeAccessorAndMutatorDescriptor(prototype, name, dynamicAttributeSettings[name]);
            if (descriptor) {
                Object.defineProperty(prototype, name, descriptor);
            }
        }
    }
    makeAccessorAndMutatorDescriptor(prototype, name, settings) {
        // does nothing if there is a setter and a getter in there
        if (settings.getter && settings.setter) {
            return undefined;
        }
        const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || { configurable: true };
        if (settings.accessor && !descriptor.get) {
            descriptor.get = function () {
                return this[this['sharedMetadata']['dynamicAttributes'][name].accessor].call(this);
            };
        }
        if (settings.mutator && !descriptor.set) {
            descriptor.set = function (value) {
                this[this['sharedMetadata']['dynamicAttributes'][name].mutator].call(this, value);
            };
        }
        return descriptor;
    }
}
exports.RecordManagerBase = RecordManagerBase;
