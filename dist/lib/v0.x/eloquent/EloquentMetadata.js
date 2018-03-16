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
class EloquentMetadata {
    static getSettingProperty(eloquent, property, defaultValue) {
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
    }
    static fillable(eloquent) {
        return this.getSettingProperty(eloquent, 'fillable', []);
    }
    static guarded(eloquent) {
        return this.getSettingProperty(eloquent, 'guarded', ['*']);
    }
    static hasSetting(eloquent, property) {
        const value = this.getSettingProperty(eloquent, property, false);
        return value !== false;
    }
    static getSettingWithTrueValue(eloquent, property, defaultValue) {
        const value = this.getSettingProperty(eloquent, property, false);
        if (value === true) {
            return defaultValue;
        }
        return value || defaultValue;
    }
    static hasTimestamps(eloquent) {
        return this.hasSetting(eloquent, 'timestamps');
    }
    static timestamps(eloquent, defaultValue = DEFAULT_TIMESTAMPS) {
        return this.getSettingWithTrueValue(eloquent, 'timestamps', defaultValue);
    }
    static hasSoftDeletes(eloquent) {
        return this.hasSetting(eloquent, 'softDeletes');
    }
    static softDeletes(eloquent, defaultValue = DEFAULT_SOFT_DELETES) {
        return this.getSettingWithTrueValue(eloquent, 'softDeletes', defaultValue);
    }
}
exports.EloquentMetadata = EloquentMetadata;
