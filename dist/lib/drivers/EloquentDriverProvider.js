"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
class EloquentDriverProvider {
    static findDefaultDriver() {
        return '';
    }
    static createDriver(model, driverClass) {
        return najs_binding_1.make(driverClass, [model]);
    }
    static create(model) {
        return this.createDriver(model, this.findDriverClassName(model));
    }
    static findDriverClassName(model) {
        const modelName = typeof model === 'string' ? model : model.getClassName();
        if (this.binding[modelName] === 'undefined' || typeof this.drivers[this.binding[modelName]] === 'undefined') {
            return this.findDefaultDriver();
        }
        return this.drivers[this.binding[modelName]].driverClassName;
    }
    static register(driver, name, isDefault) {
        najs_binding_1.register(driver);
        this.drivers[name] = {
            driverClassName: najs_binding_1.getClassName(driver),
            isDefault: isDefault
        };
    }
    static bind(model, name) {
        this.binding[model] = name;
    }
}
EloquentDriverProvider.drivers = {};
EloquentDriverProvider.binding = {};
exports.EloquentDriverProvider = EloquentDriverProvider;
