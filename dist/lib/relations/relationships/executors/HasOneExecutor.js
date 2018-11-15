"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HasOneOrManyExecutor_1 = require("./HasOneOrManyExecutor");
class HasOneExecutor extends HasOneOrManyExecutor_1.HasOneOrManyExecutor {
    async executeQuery() {
        return this.query.first();
    }
    executeCollector() {
        this.collector.limit(1);
        const result = this.collector.exec();
        if (result.length === 0) {
            return undefined;
        }
        return this.dataBucket.makeModel(this.targetModel, result[0]);
    }
    getEmptyValue() {
        return undefined;
    }
}
exports.HasOneExecutor = HasOneExecutor;
