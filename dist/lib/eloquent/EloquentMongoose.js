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
mongoose_1.Schema.prototype['setupTimestamp'] = require('./mongoose/setupTimestamp').setupTimestamp;
const DEFAULT_TIMESTAMPS = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
class EloquentMongoose extends EloquentBase_1.EloquentBase {
    getId() {
        return this.attributes._id;
    }
    setId(value) {
        this.attributes._id = value;
    }
    static Class() {
        return EloquentMongoose;
    }
    getModelName() {
        return this.getClassName();
    }
    // -------------------------------------------------------------------------------------------------------------------
    initialize(data) {
        const modelName = this.getModelName();
        const mongoose = this.getMongoose();
        if (mongoose.modelNames().indexOf(modelName) === -1) {
            const schema = this.getSchema();
            const timestampsSettings = Object.getPrototypeOf(this).constructor.timestamps;
            if (timestampsSettings === true) {
                schema.set('timestamps', DEFAULT_TIMESTAMPS);
            }
            mongoose_1.model(this.getModelName(), schema);
        }
        this.model = mongoose.model(modelName);
        this.schema = this.model.schema;
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
        return this.prototype.newQuery().queryName(name);
    }
    static select(...fields) {
        return this.prototype.newQuery().select(...fields);
    }
    static distinct(...fields) {
        return this.prototype.newQuery().distinct(...fields);
    }
    static orderBy(field, direction = 'asc') {
        return this.prototype.newQuery().orderBy(field, direction);
    }
    static orderByAsc(field) {
        return this.prototype.newQuery().orderByAsc(field);
    }
    static orderByDesc(field) {
        return this.prototype.newQuery().orderByDesc(field);
    }
    static limit(records) {
        return this.prototype.newQuery().limit(records);
    }
    static where(arg0, arg1, arg2) {
        return this.prototype.newQuery().where(arg0, arg1, arg2);
    }
    static orWhere(arg0, arg1, arg2) {
        return this.prototype.newQuery().orWhere(arg0, arg1, arg2);
    }
    static whereIn(field, values) {
        return this.prototype.newQuery().whereIn(field, values);
    }
    static whereNotIn(field, values) {
        return this.prototype.newQuery().whereNotIn(field, values);
    }
    static orWhereIn(field, values) {
        return this.prototype.newQuery().orWhereIn(field, values);
    }
    static orWhereNotIn(field, values) {
        return this.prototype.newQuery().orWhereNotIn(field, values);
    }
    static all() {
        return this.prototype.newQuery().all();
    }
    static get(...fields) {
        return this.prototype
            .newQuery()
            .select(...fields)
            .get();
    }
    static find(id) {
        if (typeof id !== 'undefined') {
            const query = this.prototype.newQuery();
            return query.where(query.getPrimaryKey(), id).find();
        }
        return this.prototype.newQuery().find();
    }
    static pluck(value, key) {
        return this.prototype.newQuery().pluck(value, key);
    }
}
exports.EloquentMongoose = EloquentMongoose;
