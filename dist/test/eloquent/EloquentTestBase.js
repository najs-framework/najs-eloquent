"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentBase_1 = require("../../lib/eloquent/EloquentBase");
const Record_1 = require("./Record");
class EloquentTestBase extends EloquentBase_1.EloquentBase {
    getReservedPropertiesList() {
        return super.getReservedPropertiesList().concat(Object.getOwnPropertyNames(EloquentTestBase.prototype));
    }
    getId() {
        return this.attributes['id'];
    }
    setId(value) {
        return (this.attributes['id'] = value);
    }
    newQuery() { }
    toObject() {
        return this.attributes.data;
    }
    toJson() {
        return this.attributes.data;
    }
    is(model) {
        return false;
    }
    fireEvent(event) {
        return this;
    }
    touch() { }
    async save() {
        await [];
    }
    async delete() { }
    async restore() { }
    async forceDelete() { }
    async fresh() {
        return this;
    }
    getAttribute(name) {
        return this.attributes.data[name];
    }
    setAttribute(name, value) {
        this.attributes.data[name] = value;
        return true;
    }
    isNativeRecord(data) {
        return data instanceof Record_1.Record;
    }
    initializeAttributes() {
        this.attributes = Record_1.Record.create({});
    }
    setAttributesByObject(nativeRecord) {
        this.attributes = Record_1.Record.create(nativeRecord);
    }
    setAttributesByNativeRecord(nativeRecord) {
        this.attributes = nativeRecord;
    }
}
exports.EloquentTestBase = EloquentTestBase;
