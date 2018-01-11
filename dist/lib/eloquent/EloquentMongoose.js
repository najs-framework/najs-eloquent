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
const EloquentBase_1 = require("./EloquentBase");
const MongooseQueryBuilder_1 = require("../query-builders/MongooseQueryBuilder");
const mongoose_1 = require("mongoose");
const najs_1 = require("najs");
const collect_js_1 = require("collect.js");
class EloquentMongoose extends EloquentBase_1.EloquentBase {
    static Class() {
        return EloquentMongoose;
    }
    getModelName() {
        return this.getClassName();
    }
    // -------------------------------------------------------------------------------------------------------------------
    initialize(data) {
        if (!this.schema) {
            this.schema = this.getSchema();
        }
        const modelName = this.getModelName();
        const mongoose = this.getMongoose();
        if (mongoose.modelNames().indexOf(modelName) === -1) {
            mongoose_1.model(this.getModelName(), this.schema);
        }
        this.model = mongoose.model(modelName);
        return super.initialize(data);
    }
    getMongoose() {
        return najs_1.make('MongooseProvider').getMongooseInstance();
    }
    isNativeRecord(data) {
        return data instanceof this.model;
    }
    initializeAttributes() {
        this.attributes = new this.model();
    }
    setAttributesByObject(data) {
        this.attributes = new this.model();
        this.attributes.set(data);
    }
    setAttributesByNativeRecord(nativeRecord) {
        this.attributes = nativeRecord;
    }
    getReservedPropertiesList() {
        return super
            .getReservedPropertiesList()
            .concat(Object.getOwnPropertyNames(EloquentMongoose.prototype), ['collection', 'model', 'schema']);
    }
    getAttribute(name) {
        return this.attributes[name];
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
        return true;
    }
    newQuery() {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.getModelName());
    }
    newInstance(document) {
        const instance = najs_1.make(this.getClassName());
        return instance.initialize(document);
    }
    newCollection(dataset) {
        return collect_js_1.default(dataset.map(item => this.newInstance(item)));
    }
    toObject() {
        return Object.assign({}, this.attributes.toObject(), this.getAllValueOfAccessors());
    }
    toJson() {
        const result = this.attributes.toJSON({
            getters: true,
            virtuals: true,
            versionKey: false
        });
        result['id'] = result['_id'];
        delete result['_id'];
        return Object.assign(result, this.getAllValueOfAccessors());
    }
    is(document) {
        return this.attributes.equals(document.attributes);
    }
    fireEvent(event) {
        this.model.emit(event, this);
        return this;
    }
    // -------------------------------------------------------------------------------------------------------------------
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.attributes.save();
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.attributes.remove();
        });
    }
    forceDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.attributes.remove();
        });
    }
    fresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.attributes.isNew) {
                // tslint:disable-next-line
                return null;
            }
            const query = this.newQuery();
            return query.where(query.getPrimaryKey(), this.attributes._id).find();
        });
    }
    // -------------------------------------------------------------------------------------------------------------------
    static queryName(name) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getClassName());
    }
    static select(...fields) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).select(...fields);
    }
    static distinct(...fields) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).distinct(...fields);
    }
    static orderBy(field, direction = 'asc') {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).orderBy(field, direction);
    }
    static orderByAsc(field) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).orderByAsc(field);
    }
    static orderByDesc(field) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).orderByDesc(field);
    }
    static limit(records) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).limit(records);
    }
    static where(arg0, arg1, arg2) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).where(arg0, arg1, arg2);
    }
    static orWhere(arg0, arg1, arg2) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).orWhere(arg0, arg1, arg2);
    }
    static whereIn(field, values) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).whereIn(field, values);
    }
    static whereNotIn(field, values) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).whereNotIn(field, values);
    }
    static orWhereIn(field, values) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).orWhereIn(field, values);
    }
    static orWhereNotIn(field, values) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).orWhereNotIn(field, values);
    }
    static all() {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).all();
    }
    static get(...fields) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).select(...fields).get();
    }
    static find(id) {
        if (typeof id !== 'undefined') {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName());
            return query.where(query.getPrimaryKey(), id).find();
        }
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.prototype.getModelName()).find();
    }
}
exports.EloquentMongoose = EloquentMongoose;
