"use strict";
/// <reference path="../contracts/MemoryDataSource.ts" />
/// <reference path="../contracts/MemoryDataSourceProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
class MemoryDataSourceProvider extends najs_facade_1.Facade {
    constructor() {
        super(...arguments);
        this.dataSources = {};
        this.dataSourceInstances = {};
        this.binding = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Provider.MemoryDataSourceProvider;
    }
    findDefaultDataSourceClassName() {
        let first = '';
        for (const name in this.dataSources) {
            if (!first) {
                first = this.dataSources[name].className;
            }
            if (this.dataSources[name].isDefault) {
                return this.dataSources[name].className;
            }
        }
        return first;
    }
    has(dataSource) {
        for (const name in this.dataSources) {
            const item = this.dataSources[name];
            if (item.className === najs_binding_1.getClassName(dataSource)) {
                return true;
            }
        }
        return false;
    }
    create(model) {
        const dataSourceClassName = this.findMemoryDataSourceClassName(model);
        const modelName = model.getModelName();
        if (typeof this.dataSourceInstances[modelName] === 'undefined') {
            this.dataSourceInstances[modelName] = najs_binding_1.make(dataSourceClassName, [model]);
        }
        return this.dataSourceInstances[modelName];
    }
    findMemoryDataSourceClassName(model) {
        const modelName = typeof model === 'string' ? model : model.getModelName();
        if (this.binding[modelName] === 'undefined' || typeof this.dataSources[this.binding[modelName]] === 'undefined') {
            return this.findDefaultDataSourceClassName();
        }
        return this.dataSources[this.binding[modelName]].className;
    }
    register(dataSource, name, isDefault = false) {
        if (typeof dataSource === 'function') {
            najs_binding_1.register(dataSource);
        }
        this.dataSources[name] = {
            className: najs_binding_1.getClassName(dataSource),
            isDefault: isDefault
        };
        return this;
    }
    bind(model, driver) {
        this.binding[model] = driver;
        return this;
    }
}
MemoryDataSourceProvider.className = constants_1.NajsEloquent.Provider.MemoryDataSourceProvider;
exports.MemoryDataSourceProvider = MemoryDataSourceProvider;
najs_binding_1.register(MemoryDataSourceProvider, constants_1.NajsEloquent.Provider.MemoryDataSourceProvider);
