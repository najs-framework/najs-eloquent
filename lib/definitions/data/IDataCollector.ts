/// <reference path="../query-builders/IConditionMatcher.ts" />

namespace NajsEloquent.Data {
  export type IConditions<T extends QueryBuilder.IConditionMatcher<any> = QueryBuilder.IConditionMatcher<any>> =
    | { $and: Array<T | IConditions<T>> }
    | { $or: Array<T | IConditions<T>> }
    | {}

  export interface IDataCollector<T> {
    /**
     * Limit number of result.
     *
     * @param {number} value
     */
    limit(value: number): this

    /**
     * Pick some fields of data in result.
     *
     * @param {string[]} selectedFields
     */
    select(selectedFields: string[]): this

    /**
     * Sort result by the given directions.
     *
     * @param {array} directions
     */
    orderBy(directions: Array<[string, string]>): this

    /**
     * Filter data by given conditions.
     *
     * @param {object} conditions
     */
    filterBy(conditions: IConditions): this

    /**
     * Determine that there is order by config or not.
     */
    hasOrderByConfig(): boolean

    /**
     * Determine that there is filter by config or not.
     */
    hasFilterByConfig(): boolean

    /**
     * Execute and get filtered data.
     */
    exec(): T[]
  }
}
