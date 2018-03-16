import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver';
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
export declare class Eloquent {
    getDriver(): IEloquentDriver;
}
