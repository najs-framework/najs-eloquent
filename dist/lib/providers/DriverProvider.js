"use strict";
/// <reference path="../contracts/DriverProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
class DriverProvider extends najs_facade_1.Facade {
    constructor() {
        super(...arguments);
        this.drivers = {};
        this.binding = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Provider.DriverProvider;
    }
    findDefaultDriver() {
        let first = '';
        for (const name in this.drivers) {
            if (!first) {
                first = this.drivers[name].driverClassName;
            }
            if (this.drivers[name].isDefault) {
                return this.drivers[name].driverClassName;
            }
        }
        return first;
    }
    createDriver(model, driverClass, isGuarded) {
        const driver = najs_binding_1.make(driverClass, [model, isGuarded]);
        // driver.createStaticMethods(<any>Object.getPrototypeOf(model).constructor)
        return driver;
    }
    create(model, isGuarded = true) {
        return this.createDriver(model, this.findDriverClassName(model), isGuarded);
    }
    findDriverClassName(model) {
        const modelName = typeof model === 'string' ? model : najs_binding_1.getClassName(model);
        if (this.binding[modelName] === 'undefined' || typeof this.drivers[this.binding[modelName]] === 'undefined') {
            return this.findDefaultDriver();
        }
        return this.drivers[this.binding[modelName]].driverClassName;
    }
    register(driver, name, isDefault = false) {
        if (typeof driver === 'function') {
            najs_binding_1.register(driver);
        }
        this.drivers[name] = {
            driverClassName: najs_binding_1.getClassName(driver),
            isDefault: isDefault
        };
        return this;
    }
    bind(model, driver) {
        this.binding[model] = driver;
        return this;
    }
}
DriverProvider.className = constants_1.NajsEloquent.Provider.DriverProvider;
exports.DriverProvider = DriverProvider;
najs_binding_1.register(DriverProvider);
