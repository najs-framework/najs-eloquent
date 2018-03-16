import { IAutoload } from 'najs-binding';
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver';
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
export declare abstract class Eloquent implements IAutoload {
    abstract getClassName(): string;
    constructor(data: any);
    getDriver(): IEloquentDriver;
    getAttribute(name: string): any;
}
