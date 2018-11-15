"use strict";
/// <reference path="../contracts/MemoryDataSource.ts" />
/// <reference path="../definitions/model/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const RecordDataReader_1 = require("./RecordDataReader");
const DataBuffer_1 = require("../data/DataBuffer");
class RecordDataSourceBase extends DataBuffer_1.DataBuffer {
    constructor(model) {
        super(model.getPrimaryKeyName(), RecordDataReader_1.RecordDataReader);
        this.modelName = model.getModelName();
    }
    getModelName() {
        return this.modelName;
    }
    add(data) {
        this.createPrimaryKeyIfNeeded(data);
        return super.add(data);
    }
    remove(data) {
        this.createPrimaryKeyIfNeeded(data);
        return super.remove(data);
    }
}
exports.RecordDataSourceBase = RecordDataSourceBase;
