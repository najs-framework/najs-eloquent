/// <reference path="../../../../lib/definitions/collect.js/index.d.ts" />
/// <reference path="../driver/IExecutor.d.ts" />
declare namespace NajsEloquent.QueryBuilder {
    interface IQueryExecutor<T extends object = object> extends Driver.IExecutor {
        /**
         * Execute query and return the records as a Collection.
         */
        get(): Promise<T[]>;
        /**
         * Execute query and returns the first record.
         */
        first(): Promise<T | null | undefined>;
        /**
         * Execute query and returns count of records.
         */
        count(): Promise<number>;
        /**
         * Update records which match the query with data.
         *
         * @param {Object} data
         */
        update(data: Object): Promise<any>;
        /**
         * Delete all records which match the query.
         */
        delete(): Promise<any>;
        /**
         * Restore all records which match the query.
         */
        restore(): Promise<any>;
        /**
         * Execute query and returns raw result.
         */
        execute(): Promise<any>;
    }
}
