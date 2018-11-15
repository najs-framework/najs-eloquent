/// <reference path="../../../../lib/definitions/collect.js/index.d.ts" />
declare namespace NajsEloquent.QueryGrammar {
    interface IAdvancedQuery<Result> {
        /**
         * Execute query and returns the first record.
         */
        first(): Promise<(Result) | null>;
        /**
         * Find first record by id
         */
        first(id: any): Promise<(Result) | null>;
        /**
         * Execute query and returns the first record.
         */
        find(): Promise<(Result) | null>;
        /**
         * Find first record by id
         */
        find(id: any): Promise<(Result) | null>;
        /**
         * Execute query and return the records as a Collection.
         */
        get(): Promise<CollectJs.Collection<Result>>;
        /**
         * Select some fields and get the result as Collection
         */
        get(...fields: Array<string | string[]>): Promise<CollectJs.Collection<Result>>;
        /**
         * Execute query and return the records as a Collection.
         */
        all(): Promise<CollectJs.Collection<Result>>;
        /**
         * Execute query and returns "pluck" result.
         */
        pluck(valueKey: string): Promise<object>;
        /**
         * Execute query and returns "pluck" result.
         */
        pluck(valueKey: string, indexKey: string): Promise<object>;
        /**
         * Find first record by id
         * @param {string} id
         */
        findById(id: any): Promise<Result | null>;
        /**
         * Find first record by id and throws NotFoundException if there is no record
         * @param {string} id
         */
        findOrFail(id: any): Promise<Result>;
        /**
         * Find first record by id and throws NotFoundException if there is no record
         * @param {string} id
         */
        firstOrFail(id: any): Promise<Result>;
    }
}
