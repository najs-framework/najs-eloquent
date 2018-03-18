import { Eloquent } from './Eloquent';
export declare type EloquentTimestamps = {
    createdAt: string;
    updatedAt: string;
};
export declare type EloquentSoftDelete = {
    deletedAt: string;
    overrideMethods: boolean | 'all' | string[];
};
export declare type EloquentAccessors = {
    [key: string]: {
        name: string;
        type: 'getter' | 'function' | string;
        ref?: string;
    };
};
export declare type EloquentMutators = {
    [key: string]: {
        name: string;
        type: 'setter' | 'function' | string;
        ref?: string;
    };
};
/**
 * This class contains all metadata parsing functions, such as:
 *   - fillable
 *   - guarded
 *   - timestamps
 *   - softDeletes
 *   - mutators
 *   - accessors
 * It's support cached in object to increase performance
 */
export declare class EloquentMetadata {
    protected model: Eloquent;
    protected prototype: any;
    protected definition: typeof Eloquent;
    protected knownAttributes: string[];
    protected accessors: EloquentAccessors;
    protected mutators: EloquentMutators;
    private constructor();
    protected buildKnownAttributes(): void;
    /**
     * Find accessors and mutators defined in getter/setter, only available for node >= 8.7
     */
    protected findGettersAndSetters(): void;
    protected findAccessorsAndMutators(): void;
    getSettingProperty<T extends any>(property: string, defaultValue: T): T;
    hasSetting(property: string): boolean;
    getSettingWithDefaultForTrueValue(property: string, defaultValue: any): any;
    fillable(): string[];
    guarded(): string[];
    hasTimestamps(): boolean;
    timestamps(defaultValue?: EloquentTimestamps): EloquentTimestamps;
    hasSoftDeletes(): boolean;
    softDeletes(defaultValue?: EloquentSoftDelete): EloquentSoftDelete;
    hasAttribute(name: string | Symbol): boolean;
    /**
     * store EloquentMetadata instance with "sample" model
     */
    protected static cached: Object;
    /**
     * get metadata of Eloquent class, it's cached
     */
    static get(model: Eloquent): EloquentMetadata;
    static get(model: Eloquent, cache: boolean): EloquentMetadata;
}
