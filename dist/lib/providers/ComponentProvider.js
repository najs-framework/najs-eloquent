"use strict";
/// <reference path="../contracts/ComponentProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../constants");
const functions_1 = require("../util/functions");
class ComponentProvider extends najs_facade_1.Facade {
    constructor() {
        super(...arguments);
        this.components = {};
        this.binding = {};
        this.extended = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Provider.ComponentProvider;
    }
    extend(model, driver) {
        const prototype = Object.getPrototypeOf(model);
        const components = this.resolveComponents(model, driver);
        for (const component of components) {
            const className = najs_binding_1.getClassName(model);
            if (typeof this.extended[className] === 'undefined') {
                this.extended[className] = [];
            }
            if (this.extended[className].indexOf(component.getClassName()) !== -1) {
                continue;
            }
            this.extended[className].push(component.getClassName());
            component.extend(prototype, this.findBasePrototypes(prototype), driver);
        }
    }
    findBasePrototypes(prototype) {
        const bases = [];
        let count = 0;
        do {
            prototype = Object.getPrototypeOf(prototype);
            bases.push(prototype);
            count++;
        } while (count < 100 && (typeof prototype === 'undefined' || prototype !== Object.prototype));
        return bases;
    }
    resolveComponents(model, driver) {
        const modelComponents = this.getComponents(najs_binding_1.getClassName(model));
        const driverComponents = driver.getModelComponentName();
        const combinedComponents = modelComponents.concat(driverComponents ? [driverComponents] : []);
        return driver.getModelComponentOrder(combinedComponents).map((name) => {
            return this.resolve(name);
        });
    }
    getComponents(model) {
        const defaultComponents = Object.keys(this.components).filter((name) => {
            return this.components[name].isDefault;
        });
        const components = model ? defaultComponents.concat(this.binding[model] || []) : defaultComponents;
        return components.sort((a, b) => {
            return this.components[a].index - this.components[b].index;
        });
    }
    resolve(component) {
        if (typeof this.components[component] === 'undefined') {
            throw new ReferenceError('Component "' + component + '" is not found.');
        }
        return najs_binding_1.make(this.components[component].className);
    }
    register(component, name, isDefault = false) {
        if (typeof component === 'function') {
            najs_binding_1.register(component);
        }
        const count = Object.keys(this.components).length;
        this.components[name] = {
            className: najs_binding_1.getClassName(component),
            isDefault: isDefault,
            index: count
        };
        return this;
    }
    bind(model, component) {
        if (typeof this.binding[model] === 'undefined') {
            this.binding[model] = [];
        }
        this.binding[model].push(component);
        this.binding[model] = functions_1.array_unique(this.binding[model]);
        return this;
    }
}
ComponentProvider.className = constants_1.NajsEloquent.Provider.ComponentProvider;
exports.ComponentProvider = ComponentProvider;
najs_binding_1.register(ComponentProvider);
