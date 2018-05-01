"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class ModelActiveRecord {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelActiveRecord;
    }
    extend(prototype, bases, driver) {
        prototype['isNew'] = ModelActiveRecord.isNew;
        prototype['delete'] = ModelActiveRecord.delete;
        prototype['save'] = ModelActiveRecord.save;
        prototype['fresh'] = ModelActiveRecord.fresh;
    }
}
ModelActiveRecord.className = constants_1.NajsEloquent.Model.Component.ModelActiveRecord;
ModelActiveRecord.isNew = function () {
    return this['driver'].isNew();
};
ModelActiveRecord.delete = function () {
    return this['driver'].delete(this.hasSoftDeletes());
};
ModelActiveRecord.save = async function () {
    await this['driver'].save();
    return this;
};
ModelActiveRecord.fresh = async function () {
    if (!this.isNew()) {
        return this.findById(this.getPrimaryKey());
    }
    // tslint:disable-next-line
    return null;
};
exports.ModelActiveRecord = ModelActiveRecord;
najs_binding_1.register(ModelActiveRecord);
