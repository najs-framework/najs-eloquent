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
        return undefined;
    }
    getQueryInfo() {
        if (this.rootModel.getModelName() === this.local.model) {
            return {
                model: this.foreign.model,
                filterKey: this.foreign.key,
                valuesKey: this.local.key
            };
        }
        return {
            model: this.local.model,
            filterKey: this.local.key,
            valuesKey: this.foreign.key
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
        // console.log('b', this.rootModel['relations'][this.name])
        return result;
    }
    async lazyLoad() {
        const info = this.getQueryInfo();
        const query = this.getModelByName(info.model)
            .newQuery(this.rootModel.getRelationDataBucket())
            .where(info.filterKey, this.rootModel.getAttribute(info.valuesKey));
        const result = this.executeQuery(query);
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
