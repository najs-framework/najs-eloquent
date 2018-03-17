import { EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata';
import { IAutoload } from 'najs-binding';
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
    constructor();
    constructor(data: Object);
    constructor(data: Record);
    abstract getClassName(): string;
    getDriver(): IEloquentDriver<Record>;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    fill(data: Object): this;
    forceFill(data: Object): this;
    getFillable(): string[];
    getGuarded(): string[];
    isFillable(key: string): boolean;
    isGuarded(key: string): boolean;
    newInstance(data: any): any;
    newCollection(dataset: any[]): Collection<this>;
}
