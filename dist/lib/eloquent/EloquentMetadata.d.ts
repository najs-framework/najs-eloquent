import { EloquentBase } from './EloquentBase';
export declare type EloquentTimestamps = {
    createdAt: string;
    updatedAt: string;
};
export declare type EloquentSoftDelete = {
    deletedAt: string;
    overrideMethods: boolean | 'all' | string[];
};
export declare class EloquentMetadata {
    static getSettingProperty<T extends any>(eloquent: EloquentBase, property: string, defaultValue: T): T;
    static getSettingProperty<T extends any>(eloquent: typeof EloquentBase, property: string, defaultValue: T): T;
    static fillable(eloquent: EloquentBase): string[];
    static fillable(eloquent: typeof EloquentBase): string[];
    static guarded(eloquent: EloquentBase): string[];
    static guarded(eloquent: typeof EloquentBase): string[];
    private static hasSetting(eloquent, property);
    private static getSettingWithTrueValue(eloquent, property, defaultValue);
    static hasTimestamps(eloquent: EloquentBase): boolean;
    static hasTimestamps(eloquent: typeof EloquentBase): boolean;
    static timestamps(eloquent: EloquentBase): EloquentTimestamps;
    static timestamps(eloquent: typeof EloquentBase): EloquentTimestamps;
    static timestamps(eloquent: EloquentBase, defaultValue: EloquentTimestamps): EloquentTimestamps;
    static timestamps(eloquent: typeof EloquentBase, defaultValue: EloquentTimestamps): EloquentTimestamps;
    static hasSoftDeletes(eloquent: EloquentBase): boolean;
    static hasSoftDeletes(eloquent: typeof EloquentBase): boolean;
    static softDeletes(eloquent: EloquentBase): EloquentSoftDelete;
    static softDeletes(eloquent: typeof EloquentBase): EloquentSoftDelete;
    static softDeletes(eloquent: EloquentBase, defaultValue: EloquentSoftDelete): EloquentSoftDelete;
    static softDeletes(eloquent: typeof EloquentBase, defaultValue: EloquentSoftDelete): EloquentSoftDelete;
}
