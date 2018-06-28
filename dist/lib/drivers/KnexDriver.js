"use strict";
/// <reference path="../contracts/Driver.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const RecordDriverBase_1 = require("./based/RecordDriverBase");
class KnexDriver extends RecordDriverBase_1.RecordBaseDriver {
    constructor(model) {
        super(model);
        this.tableName = model.getSettingProperty('table', this.formatRecordName());
        this.connectionName = model.getSettingProperty('connection', 'default');
        this.primaryKeyName = model.getSettingProperty('primaryKey', 'id');
    }
    initialize(model, isGuarded, data) { }
    getClassName() {
        return constants_1.NajsEloquent.Driver.KnexDriver;
    }
    shouldBeProxied(key) {
        return key !== 'table' && key !== 'primaryKey' && key !== 'connection';
    }
    getRecordName() {
        return this.tableName;
    }
}
exports.KnexDriver = KnexDriver;
