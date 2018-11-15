"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const accessors_1 = require("../util/accessors");
const RelationUtilities_1 = require("./RelationUtilities");
const functions_1 = require("../util/functions");
const RelationNotFoundInNewInstanceError_1 = require("../errors/RelationNotFoundInNewInstanceError");
const helpers_1 = require("../util/helpers");
class Relationship {
    constructor(rootModel, name) {
        this.rootModel = rootModel;
        this.name = name;
        this.chains = [];
    }
    get targetModel() {
        if (!this.targetModelInstance) {
            this.targetModelInstance = najs_binding_1.make(this.targetDefinition);
        }
        return this.targetModelInstance;
    }
    with(...relations) {
        this.chains = functions_1.array_unique(this.chains, lodash_1.flatten(arguments).filter(item => item !== ''));
        return this;
    }
    query(cb) {
        this.customQueryFn = cb;
        return this;
    }
    createTargetQuery(name) {
        const queryBuilder = this.targetModel.newQuery(name);
        queryBuilder.handler.setRelationDataBucket(this.getDataBucket());
        return this.applyCustomQuery(queryBuilder);
    }
    applyCustomQuery(queryBuilder) {
        if (typeof this.customQueryFn === 'function') {
            this.customQueryFn.call(queryBuilder, queryBuilder);
        }
        return queryBuilder;
    }
    getName() {
        return this.name;
    }
    getChains() {
        return this.chains;
    }
    getRelationData() {
        return accessors_1.relationFeatureOf(this.rootModel).findDataByName(this.rootModel, this.name);
    }
    getDataBucket() {
        return accessors_1.relationFeatureOf(this.rootModel).getDataBucket(this.rootModel);
    }
    isLoaded() {
        return this.getRelationData().isLoaded() || RelationUtilities_1.RelationUtilities.isLoadedInDataBucket(this, this.rootModel, this.name);
    }
    getData() {
        if (!this.isLoaded()) {
            return undefined;
        }
        const relationData = this.getRelationData();
        if (relationData.hasData()) {
            return relationData.getData();
        }
        return this.markInverseRelationshipsToLoaded(relationData.setData(this.collectData()));
    }
    markInverseRelationshipsToLoaded(result) {
        if (!result || !this.getDataBucket()) {
            return result;
        }
        if (helpers_1.isModel(result)) {
            this.getInverseRelationships(result).forEach(relation => {
                RelationUtilities_1.RelationUtilities.markLoadedInDataBucket(this, result, relation.getName());
            });
            return result;
        }
        helpers_1.distinctModelByClassInCollection(result).forEach(model => {
            this.getInverseRelationships(model).forEach(relation => {
                RelationUtilities_1.RelationUtilities.markLoadedInDataBucket(this, model, relation.getName());
            });
        });
        return result;
    }
    getInverseRelationships(model) {
        const result = [];
        const definitions = accessors_1.relationFeatureOf(model).getDefinitions(model);
        for (const name in definitions) {
            const relation = model.getRelation(name);
            if (this.isInverseOf(relation)) {
                result.push(relation);
            }
        }
        return result;
    }
    async lazyLoad() {
        return this.loadData('lazy');
    }
    async eagerLoad() {
        return this.loadData('eager');
    }
    async loadData(type) {
        const relationData = this.getRelationData().setLoadType(type);
        const result = await this.fetchData(type);
        if (type === 'lazy') {
            relationData.setData(result);
        }
        else {
            RelationUtilities_1.RelationUtilities.markLoadedInDataBucket(this, this.rootModel, this.name);
        }
        return this.loadChains(result);
    }
    async loadChains(result) {
        if (!result || !this.chains || this.chains.length === 0) {
            return result;
        }
        if (helpers_1.isModel(result)) {
            await result.load(this.chains);
            return result;
        }
        const models = helpers_1.distinctModelByClassInCollection(result);
        if (models.length > 0) {
            await Promise.all(models.map(model => model.load(this.chains)));
        }
        return result;
    }
    async load() {
        if (this.isLoaded()) {
            return this.getData();
        }
        const dataBucket = this.getDataBucket();
        if (!dataBucket) {
            if (this.rootModel.isNew()) {
                throw new RelationNotFoundInNewInstanceError_1.RelationNotFoundInNewInstanceError(this.name, this.rootModel.getModelName());
            }
            return await this.lazyLoad();
        }
        return await this.eagerLoad();
    }
    static morphMap(arg1, arg2) {
        if (typeof arg1 === 'object') {
            this.morphMapData = Object.assign({}, this.morphMapData, arg1);
        }
        if (typeof arg1 === 'string' && typeof arg2 === 'string') {
            this.morphMapData[arg1] = arg2;
        }
        if (typeof arg1 === 'string' && typeof arg2 === 'function') {
            this.morphMapData[arg1] = najs_binding_1.getClassName(arg2);
        }
        return this;
    }
    static getMorphMap() {
        return this.morphMapData;
    }
    static findModelName(type) {
        return typeof this.morphMapData[type] === 'undefined' ? type : this.morphMapData[type];
    }
    static findMorphType(model) {
        let modelName = helpers_1.isModel(model) ? model.getModelName() : '';
        if (typeof model === 'string') {
            modelName = model;
        }
        if (typeof model === 'function') {
            modelName = najs_binding_1.getClassName(model);
        }
        for (const type in this.morphMapData) {
            if (this.morphMapData[type] === modelName) {
                return type;
            }
        }
        return modelName;
    }
}
// Static API -----------------------------------
Relationship.morphMapData = {};
exports.Relationship = Relationship;
