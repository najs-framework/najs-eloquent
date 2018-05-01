/// <reference path="../../model/interfaces/IModelQueryAdvanced.ts" />
/// <reference path="../../query-builders/interfaces/IQueryBuilder.ts" />
/// <reference path="../../query-builders/interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />

namespace NajsEloquent.Wrapper {
  export class IQueryBuilderWrapper<T> {
    protected queryBuilder: NajsEloquent.QueryBuilder.IQueryBuilder & NajsEloquent.QueryBuilder.IFetchResultQuery<T>
  }
  export interface IQueryBuilderWrapper<T>
    extends NajsEloquent.QueryBuilder.IQueryBuilder,
      NajsEloquent.Model.IModelQueryAdvanced<T> {
    /**
     * Execute query and returns count of records.
     */
    count(): Promise<number>

    /**
     * Update records which match the query with data.
     *
     * @param {Object} data
     */
    update(data: Object): Promise<Object>

    /**
     * Delete all records which match the query.
     */
    delete(): Promise<Object>

    /**
     * Restore all records which match the query.
     */
    restore(): Promise<Object>

    /**
     * Execute query and returns raw result.
     */
    execute(): Promise<any>
  }
}
