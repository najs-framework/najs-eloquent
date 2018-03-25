import { Eloquent } from './Eloquent';
import { EloquentAttribute } from './EloquentAttribute';
export declare type EloquentTimestamps = {
    createdAt: string;
    updatedAt: string;
};
export declare type EloquentSoftDelete = {
    deletedAt: string;
    overrideMethods: boolean | 'all' | string[];
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
    protected attribute: EloquentAttribute;
    private constructor();
    getSettingProperty<T extends any>(property: string, defaultValue: T): T;
    hasSetting(property: string): boolean;
    getSettingWithDefaultForTrueValue(property: string, defaultValue: any): any;
    fillable(): string[];
    guarded(): string[];
    visible(): string[];
    hidden(): string[];
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
