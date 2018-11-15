"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const bson_1 = require("bson");
const constants_1 = require("../../constants");
const RecordDataSourceBase_1 = require("../RecordDataSourceBase");
class MemoryDataSource extends RecordDataSourceBase_1.RecordDataSourceBase {
    getClassName() {
        return constants_1.NajsEloquent.Driver.Memory.MemoryDataSource;
    }
    createPrimaryKeyIfNeeded(data) {
        const primaryKey = data.getAttribute(this.primaryKeyName);
        if (primaryKey) {
            return primaryKey;
        }
        const newId = new bson_1.ObjectId().toHexString();
        data.setAttribute(this.primaryKeyName, newId);
        return newId;
    }
    async read() {
        return true;
    }
    async write() {
        return true;
    }
}
MemoryDataSource.className = constants_1.NajsEloquent.Driver.Memory.MemoryDataSource;
exports.MemoryDataSource = MemoryDataSource;
najs_binding_1.register(MemoryDataSource, constants_1.NajsEloquent.Driver.Memory.MemoryDataSource);
