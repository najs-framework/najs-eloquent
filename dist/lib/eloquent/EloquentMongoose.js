"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentBase_1 = require("./EloquentBase");
const MongooseQueryBuilder_1 = require("../query-builders/MongooseQueryBuilder");
const mongoose_1 = require("mongoose");
const collect_js_1 = require("collect.js");
const najs_1 = require("najs");
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
        return najs_1.make('MongooseProvider');
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
        this.initializeModelIfNeeded(softDeleteSettings);
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(this.getModelName(), softDeleteSettings === true ? DEFAULT_SOFT_DELETES : softDeleteSettings);
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
    static queryName(name) {
        return this.prototype.newQuery(this.softDeletes).queryName(name);
    }
    static select(...fields) {
        return this.prototype.newQuery(this.softDeletes).select(...fields);
    }
    static distinct(...fields) {
        return this.prototype.newQuery(this.softDeletes).distinct(...fields);
    }
    static orderBy(field, direction = 'asc') {
        return this.prototype.newQuery(this.softDeletes).orderBy(field, direction);
    }
    static orderByAsc(field) {
        return this.prototype.newQuery(this.softDeletes).orderByAsc(field);
    }
    static orderByDesc(field) {
        return this.prototype.newQuery(this.softDeletes).orderByDesc(field);
    }
    static limit(records) {
        return this.prototype.newQuery(this.softDeletes).limit(records);
    }
    static where(arg0, arg1, arg2) {
        return this.prototype.newQuery(this.softDeletes).where(arg0, arg1, arg2);
    }
    static orWhere(arg0, arg1, arg2) {
        return this.prototype.newQuery(this.softDeletes).orWhere(arg0, arg1, arg2);
    }
    static whereIn(field, values) {
        return this.prototype.newQuery(this.softDeletes).whereIn(field, values);
    }
    static whereNotIn(field, values) {
        return this.prototype.newQuery(this.softDeletes).whereNotIn(field, values);
    }
    static orWhereIn(field, values) {
        return this.prototype.newQuery(this.softDeletes).orWhereIn(field, values);
    }
    static orWhereNotIn(field, values) {
        return this.prototype.newQuery(this.softDeletes).orWhereNotIn(field, values);
    }
    static whereNull(field) {
        return this.prototype.newQuery(this.softDeletes).whereNull(field);
    }
    static whereNotNull(field) {
        return this.prototype.newQuery(this.softDeletes).whereNotNull(field);
    }
    static orWhereNull(field) {
        return this.prototype.newQuery(this.softDeletes).orWhereNull(field);
    }
    static orWhereNotNull(field) {
        return this.prototype.newQuery(this.softDeletes).orWhereNotNull(field);
    }
    static withTrashed() {
        return this.prototype.newQuery(this.softDeletes).withTrashed();
    }
    static onlyTrashed() {
        return this.prototype.newQuery(this.softDeletes).onlyTrashed();
    }
    static all() {
        return this.prototype.newQuery(this.softDeletes).all();
    }
    static get(...fields) {
        return this.prototype
            .newQuery(this.softDeletes)
            .select(...fields)
            .get();
    }
    static find(id) {
        if (typeof id !== 'undefined') {
            const query = this.prototype.newQuery(this.softDeletes);
            return query.where(query.getPrimaryKey(), id).find();
        }
        return this.prototype.newQuery(this.softDeletes).find();
    }
    static first() {
        return this.prototype.newQuery(this.softDeletes).first();
    }
    static pluck(value, key) {
        return this.prototype.newQuery(this.softDeletes).pluck(value, key);
    }
    static count() {
        return this.prototype.newQuery(this.softDeletes).count();
    }
    static native(handler) {
        return this.prototype.newQuery(this.softDeletes).native(handler);
    }
    static findById(id) {
        return this.find(id);
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
