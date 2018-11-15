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
export declare function find_base_prototypes(prototype: Object, root: Object): Object[];
export declare type DotNotationInfo = {
    first: string;
    last: string;
    afterFirst: string;
    beforeLast: string;
    parts: string[];
};
export declare function parse_string_with_dot_notation(input: string): DotNotationInfo;
export declare function override_setting_property_of_model(model: object, property: string, values: string[]): void;
