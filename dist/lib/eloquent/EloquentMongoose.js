"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentBase_1 = require("./EloquentBase");
const MongooseQueryBuilder_1 = require("../query-builders/MongooseQueryBuilder");
const mongoose_1 = require("mongoose");
const collect_js_1 = require("collect.js");
const najs_binding_1 = require("najs-binding");
const NotFoundError_1 = require("../errors/NotFoundError");
const SoftDelete_1 = require("./mongoose/SoftDelete");
mongoose_1.Schema.prototype['setupTimestamp'] = require('./mongoose/setupTimestamp').setupTimestamp;
const DEFAULT_TIMESTAMPS = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
const DEFAULT_SOFT_DELETES = {
    deletedAt: 'deleted_at',
    overrideMethods: false
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
    initializeModelIfNeeded(softDeletes) {
        const modelName = this.getModelName();
        const mongooseProvider = this.getMongooseProvider();
        if (mongooseProvider
            .getMongooseInstance()
            .modelNames()
            .indexOf(modelName) === -1) {
            const schema = this.getSchema();
            const timestampsSettings = Object.getPrototypeOf(this).constructor.timestamps;
            if (timestampsSettings) {
                schema.set('timestamps', timestampsSettings === true ? DEFAULT_TIMESTAMPS : timestampsSettings);
            }
            if (softDeletes) {
                schema.plugin(SoftDelete_1.SoftDelete, softDeletes === true ? DEFAULT_SOFT_DELETES : softDeletes);
            }
            mongooseProvider.createModelFromSchema(modelName, schema);
        }
    }
    initialize(data) {
        this.initializeModelIfNeeded(Object.getPrototypeOf(this).constructor.softDeletes);
        this.model = this.getMongooseProvider()
            .getMongooseInstance()
            .model(this.getModelName());
        this.schema = this.model.schema;
        return super.initialize(data);
    }
    getMongooseProvider() {
        return najs_binding_1.make('MongooseProvider');
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
    newQuery(softDeletes) {
        const softDeleteSettings = softDeletes || Object.getPrototypeOf(this).constructor.softDeletes;
        this.registerIfNeeded();
        this.initializeModelIfNeeded(softDeleteSettings);
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.getModelName(), softDeleteSettings === true ? DEFAULT_SOFT_DELETES : softDeleteSettings).setQueryLogGroup(this.getQueryLogGroup());
    }
    getQueryLogGroup() {
        return 'all';
    }
    newInstance(document) {
        const instance = najs_binding_1.make(this.getClassName());
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
    touch() {
        const timestampsSettings = Object.getPrototypeOf(this).constructor.timestamps;
        if (timestampsSettings) {
            const opts = timestampsSettings === true ? DEFAULT_TIMESTAMPS : timestampsSettings;
            this.attributes.markModified(opts.updatedAt);
        }
    }
    // -------------------------------------------------------------------------------------------------------------------
    async save() {
        return this.attributes.save();
    }
    async delete() {
        if (Object.getPrototypeOf(this).constructor.softDeletes) {
            return this.attributes['delete']();
        }
        return this.attributes.remove();
    }
    async forceDelete() {
        return this.attributes.remove();
    }
    async restore() {
        if (Object.getPrototypeOf(this).constructor.softDeletes) {
            return this.attributes['restore']();
        }
    }
    async fresh() {
        if (this.attributes.isNew) {
            // tslint:disable-next-line
            return null;
        }
        const query = this.newQuery();
        return query.where(query.getPrimaryKey(), this.attributes._id).find();
    }
    // -------------------------------------------------------------------------------------------------------------------
    queryName(name) {
        return this.newQuery().queryName(name);
    }
    static queryName(name) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .queryName(name);
    }
    select(...fields) {
        return this.newQuery().select(...fields);
    }
    static select(...fields) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .select(...fields);
    }
    distinct(...fields) {
        return this.newQuery().distinct(...fields);
    }
    static distinct(...fields) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .distinct(...fields);
    }
    orderBy(field, direction = 'asc') {
        return this.newQuery().orderBy(field, direction);
    }
    static orderBy(field, direction = 'asc') {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orderBy(field, direction);
    }
    orderByAsc(field) {
        return this.newQuery().orderByAsc(field);
    }
    static orderByAsc(field) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orderByAsc(field);
    }
    orderByDesc(field) {
        return this.newQuery().orderByDesc(field);
    }
    static orderByDesc(field) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orderByDesc(field);
    }
    limit(records) {
        return this.newQuery().limit(records);
    }
    static limit(records) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .limit(records);
    }
    where(arg0, arg1, arg2) {
        return this.newQuery().where(arg0, arg1, arg2);
    }
    static where(arg0, arg1, arg2) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .where(arg0, arg1, arg2);
    }
    orWhere(arg0, arg1, arg2) {
        return this.newQuery().orWhere(arg0, arg1, arg2);
    }
    static orWhere(arg0, arg1, arg2) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orWhere(arg0, arg1, arg2);
    }
    whereIn(field, values) {
        return this.newQuery().whereIn(field, values);
    }
    static whereIn(field, values) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .whereIn(field, values);
    }
    whereNotIn(field, values) {
        return this.newQuery().whereNotIn(field, values);
    }
    static whereNotIn(field, values) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .whereNotIn(field, values);
    }
    orWhereIn(field, values) {
        return this.newQuery().orWhereIn(field, values);
    }
    static orWhereIn(field, values) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orWhereIn(field, values);
    }
    orWhereNotIn(field, values) {
        return this.newQuery().orWhereNotIn(field, values);
    }
    static orWhereNotIn(field, values) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orWhereNotIn(field, values);
    }
    whereNull(field) {
        return this.newQuery().whereNull(field);
    }
    static whereNull(field) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .whereNull(field);
    }
    whereNotNull(field) {
        return this.newQuery().whereNotNull(field);
    }
    static whereNotNull(field) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .whereNotNull(field);
    }
    orWhereNull(field) {
        return this.newQuery().orWhereNull(field);
    }
    static orWhereNull(field) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orWhereNull(field);
    }
    orWhereNotNull(field) {
        return this.newQuery().orWhereNotNull(field);
    }
    static orWhereNotNull(field) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .orWhereNotNull(field);
    }
    withTrashed() {
        return this.newQuery().withTrashed();
    }
    static withTrashed() {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .withTrashed();
    }
    onlyTrashed() {
        return this.newQuery().onlyTrashed();
    }
    static onlyTrashed() {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .onlyTrashed();
    }
    async all() {
        return this.newQuery().all();
    }
    static async all() {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .all();
    }
    async get(...fields) {
        return this.newQuery()
            .select(...fields)
            .get();
    }
    static async get(...fields) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .select(...fields)
            .get();
    }
    async find(id) {
        if (typeof id !== 'undefined') {
            const query = this.newQuery();
            return query.where(query.getPrimaryKey(), id).find();
        }
        return this.newQuery().find();
    }
    static async find(id) {
        if (typeof id !== 'undefined') {
            const query = this.prototype.newQuery(this.softDeletes);
            return query.where(query.getPrimaryKey(), id).find();
        }
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .find();
    }
    async first() {
        return this.newQuery().first();
    }
    static async first() {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .first();
    }
    pluck(value, key) {
        return this.newQuery().pluck(value, key);
    }
    static async pluck(value, key) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .pluck(value, key);
    }
    async count() {
        return this.newQuery().count();
    }
    static async count() {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .count();
    }
    native(handler) {
        return this.newQuery().native(handler);
    }
    static native(handler) {
        return Reflect.construct(this, [])
            .newQuery(this.softDeletes)
            .native(handler);
    }
    async findById(id) {
        return this.find(id);
    }
    static async findById(id) {
        return this.find(id);
    }
    async findOrFail(id) {
        const value = await this.find(id);
        if (!value) {
            throw new NotFoundError_1.NotFoundError(this.getClassName());
        }
        return value;
    }
    static async findOrFail(id) {
        const value = await this.find(id);
        if (!value) {
            throw new NotFoundError_1.NotFoundError(this.prototype.getClassName());
        }
        return value;
    }
}
exports.EloquentMongoose = EloquentMongoose;
