"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const DEFAULT_SOFT_DELETES = {
    deletedAt: 'deleted_at',
    overrideMethods: false
};
class ModelSoftDeletes {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelSoftDeletes;
    }
    extend(prototype, bases, driver) {
        prototype['hasSoftDeletes'] = ModelSoftDeletes.hasSoftDeletes;
        prototype['getSoftDeletesSetting'] = ModelSoftDeletes.getSoftDeletesSetting;
        prototype['trashed'] = ModelSoftDeletes.trashed;
        prototype['forceDelete'] = ModelSoftDeletes.forceDelete;
        prototype['restore'] = ModelSoftDeletes.restore;
    }
    static get DefaultSetting() {
        return DEFAULT_SOFT_DELETES;
    }
}
ModelSoftDeletes.className = constants_1.NajsEloquent.Model.Component.ModelSoftDeletes;
ModelSoftDeletes.hasSoftDeletes = function () {
    return this.hasSetting('softDeletes');
};
ModelSoftDeletes.getSoftDeletesSetting = function () {
    return this.getSettingWithDefaultForTrueValue('softDeletes', DEFAULT_SOFT_DELETES);
};
ModelSoftDeletes.trashed = function () {
    if (!this.hasSoftDeletes()) {
        return false;
    }
    return this['driver'].isSoftDeleted();
};
ModelSoftDeletes.forceDelete = function () {
    return this['driver'].delete(false);
};
ModelSoftDeletes.restore = function () {
    return this['driver'].restore();
};
exports.ModelSoftDeletes = ModelSoftDeletes;
najs_binding_1.register(ModelSoftDeletes);
