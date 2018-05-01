/// <reference path="../../../../lib/collect.js/index.d.ts" />
declare namespace NajsEloquent.QueryBuilder {
    interface IFetchResultQuery<T extends Object = {}> {
        /**
         * Execute query and return the records as a Collection.
         */
        get(): Promise<T[]>;
        /**
         * Execute query and returns the first record.
         */
        first(): Promise<T | null>;
        /**
         * Execute query and returns count of records.
         */
        count(): Promise<number>;
        /**
         * Update records which match the query with data.
         *
         * @param {Object} data
         */
        update(data: Object): Promise<Object>;
        /**
         * Delete all records which match the query.
         */
        delete(): Promise<Object>;
        /**
         * Restore all records which match the query.
         */
        restore(): Promise<Object>;
        /**
         * Execute query and returns raw result.
         */
        execute(): Promise<any>;
    }
}
