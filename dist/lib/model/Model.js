"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const DriverProviderFacade_1 = require("../facades/global/DriverProviderFacade");
const PrototypeManager_1 = require("../util/PrototypeManager");
const ModelEvent_1 = require("./ModelEvent");
class Model {
    constructor(data, isGuarded) {
        this.internalData = {
            relations: {}
        };
        return this.makeDriver().makeModel(this, data, isGuarded);
    }
    makeDriver() {
        this.driver = DriverProviderFacade_1.DriverProvider.create(this);
        return this.driver;
    }
    getDriver() {
        return this.driver;
    }
    getModelName() {
        return najs_binding_1.getClassName(this);
    }
    newQuery(name) {
        const query = this.driver.getQueryFeature().newQuery(this);
        return typeof name !== 'undefined' ? query.queryName(name) : query;
    }
    /**
     * Register a model class.
     *
     * @param modelClass
     */
    static register(modelClass) {
        najs_binding_1.register(modelClass);
    }
    static newQuery(name) {
        return new this().newQuery(name);
    }
    /**
     * Set the query with given name
     *
     * @param {string} name
     */
    static queryName(name) {
        return this.newQuery(name);
    }
    /**
     * Set the query log group name
     *
     * @param {string} group QueryLog group
     */
    static setLogGroup(group) {
        const query = this.newQuery();
        return query.setLogGroup.apply(query, arguments);
    }
    static select() {
        const query = this.newQuery();
        return query.select.apply(query, arguments);
    }
    static limit() {
        const query = this.newQuery();
        return query.limit.apply(query, arguments);
    }
    static orderBy() {
        const query = this.newQuery();
        return query.orderBy.apply(query, arguments);
    }
    /**
     * Add an "order by" clause to the query with direction ASC.
     *
     * @param {string} field
     * @param {string} direction
     */
    static orderByAsc(field) {
        const query = this.newQuery();
        return query.orderByAsc.apply(query, arguments);
    }
    /**
     * Add an "order by" clause to the query with direction DESC.
     *
     * @param {string} field
     * @param {string} direction
     */
    static orderByDesc(field) {
        const query = this.newQuery();
        return query.orderByDesc.apply(query, arguments);
    }
    /**
     * Consider all soft-deleted or not-deleted items.
     */
    static withTrashed() {
        const query = this.newQuery();
        return query.withTrashed.apply(query, arguments);
    }
    /**
     * Consider soft-deleted items only.
     */
    static onlyTrashed() {
        const query = this.newQuery();
        return query.onlyTrashed.apply(query, arguments);
    }
    static where() {
        const query = this.newQuery();
        return query.where.apply(query, arguments);
    }
    static whereNot(field, value) {
        const query = this.newQuery();
        return query.whereNot.apply(query, arguments);
    }
    static whereIn(field, values) {
        const query = this.newQuery();
        return query.whereIn.apply(query, arguments);
    }
    static whereNotIn(field, values) {
        const query = this.newQuery();
        return query.whereNotIn.apply(query, arguments);
    }
    static whereNull(field) {
        const query = this.newQuery();
        return query.whereNull.apply(query, arguments);
    }
    static whereNotNull(field) {
        const query = this.newQuery();
        return query.whereNotNull.apply(query, arguments);
    }
    static whereBetween(field, range) {
        const query = this.newQuery();
        return query.whereBetween.apply(query, arguments);
    }
    static whereNotBetween(field, range) {
        const query = this.newQuery();
        return query.whereNotBetween.apply(query, arguments);
    }
    static get() {
        const query = this.newQuery();
        return query.get.apply(query, arguments);
    }
    /**
     * Execute query and return result as a Collection.
     */
    static all() {
        const query = this.newQuery();
        return query.all.apply(query, arguments);
    }
    /**
     * return count of the records.
     */
    static count() {
        const query = this.newQuery();
        return query.count.apply(query, arguments);
    }
    static pluck() {
        const query = this.newQuery();
        return query.pluck.apply(query, arguments);
    }
    /**
     * Find first record by id.
     *
     * @param {string} id
     */
    static findById(id) {
        const query = this.newQuery();
        return query.findById.apply(query, arguments);
    }
    /**
     * Find first record by id and throws NotFoundException if there is no record
     * @param {string} id
     */
    static findOrFail(id) {
        const query = this.newQuery();
        return query.findOrFail.apply(query, arguments);
    }
    /**
     * Find first record by id and throws NotFoundException if there is no record
     * @param {string} id
     */
    static firstOrFail(id) {
        const query = this.newQuery();
        return query.firstOrFail.apply(query, arguments);
    }
    static with() {
        const query = this.newQuery();
        return query.with.apply(query, arguments);
    }
}
// static start query methods ----------------------------------------------------------------------------------------
Model.Event = ModelEvent_1.ModelEvent;
exports.Model = Model;
PrototypeManager_1.PrototypeManager.stopFindingRelationsIn(Model.prototype);
Object.defineProperty(Model.prototype, '_isNajsEloquentModel', { value: true });
