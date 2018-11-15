/// <reference path="IBasicQuery.ts" />

namespace NajsEloquent.QueryGrammar {
  export interface IQuery extends IBasicQuery {
    /**
     * Set the query with given name
     *
     * @param {string} name
     */
    queryName(name: string): this

    /**
     * Set the query log group name
     *
     * @param {string} group QueryLog group
     */
    setLogGroup(group: string): this

    /**
     * Add an "order by" clause to the query with direction ASC.
     *
     * @param {string} field
     * @param {string} direction
     */
    orderByAsc(field: string): this

    /**
     * Add an "order by" clause to the query with direction DESC.
     *
     * @param {string} field
     * @param {string} direction
     */
    orderByDesc(field: string): this

    /**
     * Consider all soft-deleted or not-deleted items.
     */
    withTrashed(): this

    /**
     * Consider soft-deleted items only.
     */
    onlyTrashed(): this
  }
}
