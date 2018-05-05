"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HasOneOrMany {
    constructor(oneToOne, local, foreign) {
        this.is1v1 = oneToOne;
        this.local = local;
        this.foreign = foreign;
    }
    load(model) {
        if (model.getModelName() === this.local.model) {
            return this.loadByLocal(model);
        }
        return this.loadByForeign(model);
    }
    loadByLocal(localModel) {
        const foreignModel = {};
        const query = foreignModel.newQuery().where(this.foreign.key, localModel.getAttribute(this.local.key));
        if (this.is1v1) {
            return query.first();
        }
        return query.get();
    }
    loadByForeign(foreignModel) {
        const localModel = {};
        const query = localModel.newQuery().where(this.local.key, foreignModel.getAttribute(this.foreign.key));
        return query.first();
    }
}
exports.HasOneOrMany = HasOneOrMany;
