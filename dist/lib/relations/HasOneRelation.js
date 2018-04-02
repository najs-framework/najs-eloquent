"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const RelationProxy_1 = require("./RelationProxy");
class HasOneRelation {
    constructor(localModel, foreignModel, localKey, foreignKey) {
        this.loaded = false;
        this.localModel = localModel;
        this.foreignModel = foreignModel;
        this.localKey = localKey;
        this.foreignKey = foreignKey;
        return new Proxy(this, RelationProxy_1.RelationProxy);
    }
    setLocal(local) {
        this.local = local;
    }
    setForeign(foreign) {
        this.foreign = foreign;
    }
    isLoaded() {
        return this.loaded;
    }
    load() {
        if (!this.local && !this.foreign) {
            throw new Error('...');
        }
        // const isLocal = !!this.local
        // const model: Eloquent<any> = this.getModelByName(this.local ? this.foreignModel : this.localModel)
        // model['where'](isLocal ? this.foreignKey : this.localKey, this.local.getId());
        return {};
    }
    getModelByName(name) {
        return najs_binding_1.make(name, []);
    }
}
exports.HasOneRelation = HasOneRelation;
