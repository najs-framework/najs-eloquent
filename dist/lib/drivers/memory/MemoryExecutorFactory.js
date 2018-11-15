"use strict";
/// <reference path="../../definitions/driver/IExecutorFactory.ts" />
/// <reference path="../../definitions/features/IRecordExecutor.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const MemoryRecordExecutor_1 = require("./MemoryRecordExecutor");
const MemoryQueryExecutor_1 = require("./MemoryQueryExecutor");
const MemoryQueryLog_1 = require("./MemoryQueryLog");
const MemoryDataSourceProviderFacade_1 = require("../../facades/global/MemoryDataSourceProviderFacade");
class MemoryExecutorFactory {
    makeRecordExecutor(model, record) {
        return new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, this.getDataSource(model), this.makeLogger());
    }
    makeQueryExecutor(handler) {
        return new MemoryQueryExecutor_1.MemoryQueryExecutor(handler, this.getDataSource(handler.getModel()), this.makeLogger());
    }
    getClassName() {
        return constants_1.NajsEloquent.Driver.Memory.MemoryExecutorFactory;
    }
    getDataSource(model) {
        return MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.create(model);
    }
    makeLogger() {
        return new MemoryQueryLog_1.MemoryQueryLog();
    }
}
MemoryExecutorFactory.className = constants_1.NajsEloquent.Driver.Memory.MemoryExecutorFactory;
exports.MemoryExecutorFactory = MemoryExecutorFactory;
najs_binding_1.register(MemoryExecutorFactory, constants_1.NajsEloquent.Driver.Memory.MemoryExecutorFactory, true, true);
