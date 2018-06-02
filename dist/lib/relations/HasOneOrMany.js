"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../wrappers/interfaces/IQueryBuilderWrapper.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Relation_1 = require("./Relation");
const constants_1 = require("../constants");
const RelationType_1 = require("./RelationType");
class HasOneOrMany extends Relation_1.Relation {
    getClassName() {
        return constants_1.NajsEloquent.Relation.HasOneOrMany;
    }
    setup(oneToOne, local, foreign) {
        this.is1v1 = oneToOne;
        this.local = local;
        this.foreign = foreign;
    }
    isInverseOf(relation) {
        if (!(relation instanceof HasOneOrMany)) {
            return false;
        }
        if (!this.isInverseOfTypeMatched(relation)) {
            return false;
        }
        return (this.compareRelationInfo(this.local, relation.local) && this.compareRelationInfo(this.foreign, relation.foreign));
    }
    isInverseOfTypeMatched(relation) {
        if (this.type !== RelationType_1.RelationType.BelongsTo && relation.type !== RelationType_1.RelationType.BelongsTo) {
            return false;
        }
        if (this.type === RelationType_1.RelationType.BelongsTo) {
            return relation.type === RelationType_1.RelationType.HasMany || relation.type === RelationType_1.RelationType.HasOne;
        }
        return this.type === RelationType_1.RelationType.HasMany || this.type === RelationType_1.RelationType.HasOne;
    }
    buildData() {
        this.relationData.isBuilt = true;
        const relationDataBucket = this.rootModel.getRelationDataBucket();
        if (!relationDataBucket) {
            return undefined;
        }
        const info = this.getQueryInfo();
        const data = this.makeModelOrCollectionFromRecords(relationDataBucket, info.table, !this.is1v1, relationDataBucket.filter(info.table, info.filterKey, this.rootModel.getAttribute(info.valuesKey), this.is1v1));
        this.relationData.data = data;
        return data;
    }
    getQueryInfo() {
        const isUsingLocal = this.rootModel.getModelName() === this.local.model;
        const local = isUsingLocal ? this.local : this.foreign;
        const foreign = isUsingLocal ? this.foreign : this.local;
        return {
            model: foreign.model,
            table: foreign.table,
            filterKey: foreign.key,
            valuesKey: local.key
        };
    }
    async eagerLoad() {
        const info = this.getQueryInfo();
        const query = this.getModelByName(info.model)
            .newQuery(this.rootModel.getRelationDataBucket())
            .whereIn(info.filterKey, this.getKeysInDataBucket(this.rootModel.getRecordName(), info.valuesKey));
        const result = await query.get();
        this.relationData.isLoaded = true;
        this.relationData.loadType = 'eager';
        this.relationData.isBuilt = false;
        return result;
    }
    async lazyLoad() {
        const info = this.getQueryInfo();
        const query = this.getModelByName(info.model)
            .newQuery(this.rootModel.getRelationDataBucket())
            .where(info.filterKey, this.rootModel.getAttribute(info.valuesKey));
        const result = await this.executeQuery(query);
        this.relationData.isLoaded = true;
        this.relationData.loadType = 'lazy';
        this.relationData.isBuilt = true;
        this.relationData.data = result;
        return result;
    }
    async executeQuery(query) {
        if (this.is1v1) {
            return query.first();
        }
        return query.get();
    }
    associate(model) {
        const rootIsLocal = this.rootModel.getModelName() === this.local.model;
        if (rootIsLocal) {
            const localPrimaryKey = this.rootModel.getAttribute(this.local.key);
            // if (!localPrimaryKey) {
            //   console.log('please save root model first')
            // }
            // if (model.getModelName() !== this.foreign.model) {
            //   console.log('can not associate the model')
            // }
            model.setAttribute(this.foreign.key, localPrimaryKey);
            this.rootModel.on('saved', async function () {
                await model.save();
            });
        }
        else {
            // if (model.getModelName() !== this.local.model) {
            //   console.log('can not associate the model')
            // }
            const localPrimaryKey = model.getAttribute(this.local.key);
            // if (!localPrimaryKey) {
            //   console.log('please save root model first')
            // }
            this.rootModel.setAttribute(this.foreign.key, localPrimaryKey);
        }
        return this;
    }
}
HasOneOrMany.className = constants_1.NajsEloquent.Relation.HasOneOrMany;
exports.HasOneOrMany = HasOneOrMany;
najs_binding_1.register(HasOneOrMany, constants_1.NajsEloquent.Relation.HasOneOrMany);
