"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentBase_1 = require("./EloquentBase");
const DEFAULT_TIMESTAMPS = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
const DEFAULT_SOFT_DELETES = {
    deletedAt: 'deleted_at',
    overrideMethods: false
};
exports.EloquentMetadata = {
    getSettingProperty(eloquent, property, defaultValue) {
        if (eloquent instanceof EloquentBase_1.EloquentBase) {
            const definition = Object.getPrototypeOf(eloquent).constructor;
            if (definition[property]) {
                return definition[property];
            }
            return eloquent[property] ? eloquent[property] : defaultValue;
        }
        if (eloquent[property]) {
            return eloquent[property];
        }
        const instance = Reflect.construct(eloquent, []);
        return instance[property] ? instance[property] : defaultValue;
    },
    fillable(eloquent) {
        return this.getSettingProperty(eloquent, 'fillable', []);
    },
    guarded(eloquent) {
        return this.getSettingProperty(eloquent, 'guarded', ['*']);
    },
    timestamps(eloquent, defaultValue = DEFAULT_TIMESTAMPS) {
        return this.getSettingProperty(eloquent, 'timestamps', defaultValue);
    },
    softDeletes(eloquent, defaultValue = DEFAULT_SOFT_DELETES) {
        return this.getSettingProperty(eloquent, 'softDeletes', defaultValue);
    }
};
