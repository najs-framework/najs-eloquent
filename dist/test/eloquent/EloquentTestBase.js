"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentBase_1 = require("../../lib/eloquent/EloquentBase");
const Record_1 = require("./Record");
class EloquentTestBase extends EloquentBase_1.EloquentBase {
    getReservedPropertiesList() {
        return super.getReservedPropertiesList().concat(Object.getOwnPropertyNames(EloquentTestBase.prototype));
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
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield [];
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    forceDelete() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    fresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
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
