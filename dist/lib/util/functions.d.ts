/**
 * Check the given key is in the array or not
 *
 * @param {mixed} key
 * @param {mixed[]} args
 */
export declare function in_array<T>(key: T, ...args: T[][]): boolean;
/**
 * Return new array which filter duplicated item in given array.
 *
 * @param {mixed[]} array
 */
export declare function array_unique<T>(...array: Array<T[] | ArrayLike<any>>): T[];
