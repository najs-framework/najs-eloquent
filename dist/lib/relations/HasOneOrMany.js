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
    async eagerLoad() {
        return undefined;
    }
    async lazyLoad() {
        const rootIsLocal = this.rootModel.getModelName() === this.local.model;
        const queryModelName = rootIsLocal ? this.foreign.model : this.local.model;
        const leftHandKey = rootIsLocal ? this.foreign.key : this.local.key;
        const rightHandKey = rootIsLocal ? this.local.key : this.foreign.key;
        const query = this.getModelByName(queryModelName)
            .newQuery(this.rootModel.getRelationDataBucket())
            .where(leftHandKey, this.rootModel.getAttribute(rightHandKey));
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
