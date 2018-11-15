"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../definitions/features/IRecordManager.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../RecordManager");
const najs_binding_1 = require("najs-binding");
const DriverBase_1 = require("../DriverBase");
const constants_1 = require("../../constants");
const MemoryQueryBuilderFactory_1 = require("./MemoryQueryBuilderFactory");
const MemoryExecutorFactory_1 = require("./MemoryExecutorFactory");
class MemoryDriver extends DriverBase_1.DriverBase {
    constructor() {
        super();
        this.recordManager = najs_binding_1.make(constants_1.NajsEloquent.Feature.RecordManager, [najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className)]);
    }
    getClassName() {
        return constants_1.NajsEloquent.Driver.MemoryDriver;
    }
    getRecordManager() {
        return this.recordManager;
    }
    makeQueryBuilderFactory() {
        return najs_binding_1.make(MemoryQueryBuilderFactory_1.MemoryQueryBuilderFactory.className);
    }
}
MemoryDriver.Name = 'memory';
exports.MemoryDriver = MemoryDriver;
najs_binding_1.register(MemoryDriver, constants_1.NajsEloquent.Driver.MemoryDriver);
