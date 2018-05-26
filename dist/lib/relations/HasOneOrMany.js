"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../wrappers/interfaces/IQueryBuilderWrapper.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Relation_1 = require("./Relation");
const constants_1 = require("../constants");
class HasOneOrMany extends Relation_1.Relation {
    getClassName() {
        return constants_1.NajsEloquent.Relation.HasOneOrMany;
    }
    setup(oneToOne, local, foreign) {
        this.is1v1 = oneToOne;
        this.local = local;
        this.foreign = foreign;
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
}
HasOneOrMany.className = constants_1.NajsEloquent.Relation.HasOneOrMany;
exports.HasOneOrMany = HasOneOrMany;
najs_binding_1.register(HasOneOrMany, constants_1.NajsEloquent.Relation.HasOneOrMany);
