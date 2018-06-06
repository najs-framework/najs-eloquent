/**
 * Base class for drivers which are native mongodb or knex. Handles attribute interactions only.
 */
export declare class Record {
    protected data: object;
    protected modified: string[];
    constructor(data?: object | Record);
    getAttribute<T>(path: string): T;
    setAttribute<T>(path: string, value: T): boolean;
    getModified(): string[];
    markModified(name: string): void;
    toObject(): object;
}
