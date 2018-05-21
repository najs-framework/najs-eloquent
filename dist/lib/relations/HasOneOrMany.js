"use strict";
/// <reference path="../model/interfaces/IModel.ts" />
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
    async lazyLoad() {
        // if (this.rootModel.getModelName() === this.local.model) {
        //   this.loadByLocal(this.rootModel)
        // } else {
        //   this.loadByForeign(this.rootModel)
        // }
    }
    async eagerLoad() { }
}
HasOneOrMany.className = constants_1.NajsEloquent.Relation.HasOneOrMany;
exports.HasOneOrMany = HasOneOrMany;
najs_binding_1.register(HasOneOrMany, constants_1.NajsEloquent.Relation.HasOneOrMany);
