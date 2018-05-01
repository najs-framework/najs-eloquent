/// <reference path="IModel.d.ts" />
/// <reference path="../../query-builders/interfaces/IQueryBuilder.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
declare namespace NajsEloquent.Model {
    interface IModelQueryAdvanced<T> {
        /**
         * Execute query and returns the first record.
         */
        first(): Promise<(IModel<T> & T) | null>;
        /**
         * Find first record by id
         */
        first(id: any): Promise<(IModel<T> & T) | null>;
        /**
         * Execute query and returns the first record.
         */
        find(): Promise<(IModel<T> & T) | null>;
        /**
         * Find first record by id
         */
        find(id: any): Promise<(IModel<T> & T) | null>;
        /**
         * Execute query and return the records as a Collection.
         */
        get(): Promise<CollectJs.Collection<IModel<T> & T>>;
        /**
         * Select some fields and get the result as Collection
         */
        get(...fields: Array<string | string[]>): Promise<CollectJs.Collection<IModel<T> & T>>;
        /**
         * Execute query and return the records as a Collection.
         */
        all(): Promise<CollectJs.Collection<IModel<T> & T>>;
        /**
         * Execute query and returns count of records.
         */
        count(): Promise<number>;
        /**
         * Execute query and returns "pluck" result.
         */
        pluck(valueKey: string): Promise<Object>;
        /**
         * Execute query and returns "pluck" result.
         */
        pluck(valueKey: string, indexKey: string): Promise<Object>;
        /**
         * Find first record by id
         * @param {string} id
         */
        findById(id: any): Promise<IModel<T> & T | null>;
        /**
         * Find first record by id and throws NotFoundException if there is no record
         * @param {string} id
         */
        findOrFail(id: any): Promise<IModel<T> & T>;
        /**
         * Find first record by id and throws NotFoundException if there is no record
         * @param {string} id
         */
        firstOrFail(id: any): Promise<IModel<T> & T>;
    }
}
