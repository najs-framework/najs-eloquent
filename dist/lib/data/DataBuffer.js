"use strict";
/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/data/IDataBuffer.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const DataCollector_1 = require("./DataCollector");
class DataBuffer {
    constructor(primaryKeyName, reader) {
        this.primaryKeyName = primaryKeyName;
        this.buffer = new Map();
        this.reader = reader;
    }
    getPrimaryKeyName() {
        return this.primaryKeyName;
    }
    getDataReader() {
        return this.reader;
    }
    getBuffer() {
        return this.buffer;
    }
    add(data) {
        this.buffer.set(this.reader.getAttribute(data, this.primaryKeyName), data);
        return this;
    }
    remove(data) {
        this.buffer.delete(this.reader.getAttribute(data, this.primaryKeyName));
        return this;
    }
    find(cb) {
        return Array.from(this.buffer.values()).find(cb);
    }
    filter(cb) {
        return Array.from(this.buffer.values()).filter(cb);
    }
    map(cb) {
        return Array.from(this.buffer.values()).map(cb);
    }
    reduce(cb, initialValue) {
        return Array.from(this.buffer.values()).reduce(cb, initialValue);
    }
    keys() {
        return Array.from(this.buffer.keys());
    }
    [Symbol.iterator]() {
        return this.buffer.values();
    }
    getCollector() {
        return new DataCollector_1.DataCollector(this, this.reader);
    }
}
exports.DataBuffer = DataBuffer;
