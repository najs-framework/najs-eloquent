"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
class DefaultEloquentDriverProvider {
    constructor() {
        this.drivers = {};
        this.binding = {};
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
    createDriver(model, driverClass) {
        return najs_binding_1.make(driverClass, [model]);
    }
    create(model) {
        return this.createDriver(model, this.findDriverClassName(model));
    }
    findDriverClassName(model) {
        const modelName = typeof model === 'string' ? model : model.getClassName();
        if (this.binding[modelName] === 'undefined' || typeof this.drivers[this.binding[modelName]] === 'undefined') {
            return this.findDefaultDriver();
        }
        return this.drivers[this.binding[modelName]].driverClassName;
    }
    register(driver, name, isDefault = false) {
        najs_binding_1.register(driver);
        this.drivers[name] = {
            driverClassName: najs_binding_1.getClassName(driver),
            isDefault: isDefault
        };
    }
    bind(model, driver) {
        this.binding[model] = driver;
    }
}
DefaultEloquentDriverProvider.className = 'EloquentDriverProvider';
exports.EloquentDriverProvider = new DefaultEloquentDriverProvider();
