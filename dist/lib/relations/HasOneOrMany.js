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
    async eagerLoad() { }
    async lazyLoad() {
        const rootIsLocal = this.rootModel.getModelName() === this.local.model;
        const queryModelName = rootIsLocal ? this.foreign.model : this.local.model;
        const leftHandKey = rootIsLocal ? this.foreign.key : this.local.key;
        const rightHandKey = rootIsLocal ? this.local.key : this.foreign.key;
        const query = this.getModelByName(queryModelName)
            .newQuery(this.rootModel.getRelationDataBucket())
            .where(leftHandKey, this.rootModel.getAttribute(rightHandKey));
        return this.executeQuery(query);
    }
    // async loadById(queryModelName: string, leftHandKey: string, rightHandKey: string) {
    //   const query = this.getModelByName(queryModelName)
    //     .newQuery(this.rootModel.getRelationDataBucket())
    //     .where(leftHandKey, this.rootModel.getAttribute(rightHandKey))
    //   return this.executeQuery(query)
    // }
    // async loadByLocal(localModel: NajsEloquent.Model.IModel<any>) {
    //   const foreignModel = this.getModelByName(this.foreign.model)
    //   const query = foreignModel
    //     .newQuery(localModel.getRelationDataBucket())
    //     .where(this.foreign.key, localModel.getAttribute(this.local.key))
    //   return this.executeQuery(query)
    // }
    // async loadByForeign(foreignModel: NajsEloquent.Model.IModel<any>) {
    //   const localModel = <any>this.getModelByName(this.local.model)
    //   const query = localModel
    //     .newQuery(foreignModel.getRelationDataBucket())
    //     .where(this.local.key, foreignModel.getAttribute(this.foreign.key))
    //   return this.executeQuery(query)
    // }
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
