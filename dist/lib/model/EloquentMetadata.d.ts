import { Eloquent } from './Eloquent';
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
    private constructor();
    static get(model: Eloquent | typeof Eloquent, cache?: boolean): EloquentMetadata;
}
