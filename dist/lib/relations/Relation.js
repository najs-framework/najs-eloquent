"use strict";
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../collect.js/index.d.ts" />
/// <reference path="../model/interfaces/IEloquent.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const RelationType_1 = require("./RelationType");
const helpers_1 = require("../util/helpers");
class Relation {
    constructor(rootModel, name, type) {
        this.rootModel = rootModel;
        this.name = name;
        this.type = type || RelationType_1.RelationType.Unknown;
    }
    get relationData() {
        return this.rootModel['relations'][this.name];
    }
    getType() {
        return this.type;
    }
    with(...names) {
        this.loadChain = lodash_1.flatten(arguments).filter(item => item !== '');
        return this;
    }
    getAttachedPropertyName() {
        return this.name;
    }
    isLoaded() {
        return (!!this.relationData.isLoaded ||
            (typeof this.rootModel['relationDataBucket'] !== 'undefined' &&
                this.rootModel['relationDataBucket'].isRelationLoaded(this.rootModel.getModelName(), this.name)));
    }
    isBuilt() {
        return !!this.relationData.isBuilt;
    }
    markLoad(loaded) {
        this.relationData.isLoaded = loaded;
        return this;
    }
    markBuild(built) {
        this.relationData.isBuilt = built;
        return this;
    }
    getDataBucket() {
        return this.rootModel['relationDataBucket'];
    }
    getModelByName(model) {
        return najs_binding_1.make(model);
    }
    getKeysInDataBucket(table, key) {
        const relationDataBucket = this.rootModel.getRelationDataBucket();
        if (!relationDataBucket) {
            return [];
        }
        return relationDataBucket.getAttributes(table, key);
    }
    compareRelationInfo(a, b) {
        return a.model === b.model && a.table === b.table && a.key === b.key;
    }
    makeModelOrCollectionFromRecords(relationDataBucket, table, makeCollection, records) {
        if (makeCollection) {
            return relationDataBucket.makeCollectionFromRecords(table, records);
        }
        if (records.length === 0) {
            return undefined;
        }
        return relationDataBucket.makeModelFromRecord(table, records[0]);
    }
    getData() {
        if (!this.isLoaded()) {
            return undefined;
        }
        if (this.isBuilt()) {
            return this.relationData.data;
        }
        return this.setInverseRelationsLoadedStatus(this.buildData());
    }
    hasInverseData(relation) {
        return this.isInverseOf(relation);
    }
    setInverseRelationsLoadedStatus(result) {
        if (!result) {
            return result;
        }
        if (helpers_1.isModel(result)) {
            this.findAndMarkLoadedInverseRelations(result);
            return result;
        }
        this.takeAndRunSampleModelInCollection(result, model => {
            this.findAndMarkLoadedInverseRelations(model);
        });
        return result;
    }
    findAndMarkLoadedInverseRelations(model) {
        const dataBucket = this.rootModel.getRelationDataBucket();
        if (!dataBucket) {
            return;
        }
        // hidden api, load relationsMap dynamically
        model['bindRelationMapIfNeeded']();
        for (const name in model['relationsMap']) {
            const relation = model.getRelationByName(name);
            if (this.hasInverseData(relation)) {
                dataBucket.markRelationLoaded(model.getModelName(), name);
            }
        }
    }
    async load() {
        if (this.isLoaded() && this.isBuilt()) {
            return this.relationData.data;
        }
        const dataBucket = this.rootModel.getRelationDataBucket();
        if (!dataBucket) {
            if (this.rootModel.isNew()) {
                throw new Error(`Can not load relation "${this.name}" in a new instance of "${this.rootModel.getModelName()}".`);
            }
            return this.loadChainRelations(await this.lazyLoad());
        }
        dataBucket.markRelationLoaded(this.rootModel.getModelName(), this.name);
        return this.loadChainRelations(await this.eagerLoad());
    }
    async loadChainRelations(result) {
        if (!result || !this.loadChain || this.loadChain.length === 0) {
            return result;
        }
        if (helpers_1.isModel(result)) {
            await result.load(this.loadChain);
            return result;
        }
        await this.takeAndRunSampleModelInCollectionAsync(result, async (model) => {
            await model.load(this.loadChain);
        });
        return result;
    }
    async takeAndRunSampleModelInCollectionAsync(collection, handle) {
        const samples = this.getSampleModelsInCollection(collection);
        for (const sample of samples) {
            await handle(sample);
        }
    }
    takeAndRunSampleModelInCollection(collection, handle) {
        this.getSampleModelsInCollection(collection).forEach(handle);
    }
    getSampleModelsInCollection(collection) {
        const result = [];
        if (!helpers_1.isCollection(collection) || collection.isEmpty()) {
            return result;
        }
        const samples = {};
        for (let i = 0, l = collection.count(); i < l; i++) {
            const model = collection.get(i);
            if (samples[model.getModelName()] === true) {
                continue;
            }
            samples[model.getModelName()] = true;
            result.push(model);
        }
        return result;
    }
}
exports.Relation = Relation;
