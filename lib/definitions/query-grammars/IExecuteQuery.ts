/// <reference path="../collect.js/index.d.ts" />

namespace NajsEloquent.QueryGrammar {
  export interface IExecuteQuery {
    /**
     * Execute query and returns count of records.
     */
    count(): Promise<number>

    /**
     * Update records which match the query with data.
     *
     * @param {Object} data
     */
    update(data: Object): Promise<any>

    /**
     * Delete all records which match the query.
     */
    delete(): Promise<any>

    /**
     * Restore all records which match the query.
     */
    restore(): Promise<any>

    /**
     * Execute query and returns raw result.
     */
    execute(): Promise<any>
  }
}
