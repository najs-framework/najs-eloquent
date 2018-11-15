"use strict";
/// <reference path="../../contracts/MemoryDataSource.ts" />
/// <reference path="../../definitions/model/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultConvention_1 = require("../../query-builders/shared/DefaultConvention");
const RecordExecutorBase_1 = require("../RecordExecutorBase");
class MemoryRecordExecutor extends RecordExecutorBase_1.RecordExecutorBase {
    constructor(model, record, dataSource, logger) {
        super(model, record, new DefaultConvention_1.DefaultConvention());
        this.dataSource = dataSource;
        this.logger = logger;
    }
    async saveRecord(action) {
        this.logRaw('add', this.record.toObject()).action(`${this.model.getModelName()}.${action}()`);
        return this.shouldExecute()
            ? this.dataSource
                .add(this.record)
                .write()
                .then(success => {
                return this.logger.end({
                    ok: success
                });
            })
            : this.logger.end({});
    }
    async createRecord(action) {
        return this.saveRecord(action);
    }
    async updateRecord(action) {
        return this.saveRecord(action);
    }
    async hardDeleteRecord() {
        this.logRaw('remove', this.record.toObject()).action(`${this.model.getModelName()}.hardDelete()`);
        return this.shouldExecute()
            ? this.dataSource
                .remove(this.record)
                .write()
                .then(success => {
                return this.logger.end({
                    ok: success
                });
            })
            : this.logger.end({});
    }
    logRaw(func, data) {
        return this.logger.raw(this.dataSource.getClassName(), `.${func}(`, data, ').write()');
    }
}
exports.MemoryRecordExecutor = MemoryRecordExecutor;
