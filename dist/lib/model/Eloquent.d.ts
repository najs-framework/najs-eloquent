import { IAutoload } from 'najs-binding';
import { EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata';
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver';
import { Collection } from 'collect.js';
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
export declare abstract class Eloquent<Record extends Object = {}> implements IAutoload {
    protected driver: IEloquentDriver<Record>;
    protected fillable?: string[];
    protected guarded?: string[];
    protected timestamps?: EloquentTimestamps | boolean;
    protected softDeletes?: EloquentSoftDelete | boolean;
    protected table?: string;
    protected collection?: string;
    protected schema?: Object;
    protected options?: Object;
    constructor();
    constructor(data: Object);
    constructor(data: Record);
    abstract getClassName(): string;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    toObject(): Object;
    toJSON(): Object;
    toJson(): Object;
    fill(data: Object): this;
    forceFill(data: Object): this;
    getFillable(): string[];
    getGuarded(): string[];
    isFillable(key: string): boolean;
    isGuarded(key: string): boolean;
    newInstance(data?: Object | Record): this;
    newCollection(dataset: Array<Object | Record>): Collection<this>;
    protected getReservedProperties(): Array<string>;
}
