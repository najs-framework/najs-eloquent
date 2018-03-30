import { OrderDirection, IBasicQuery } from '../../query-builders/interfaces/IBasicQuery'
import { Operator, SubCondition, IConditionQuery } from '../../query-builders/interfaces/IConditionQuery'
import { ISoftDeletesQuery } from '../../query-builders/interfaces/ISoftDeletesQuery'
import { IFetchResultQuery } from '../../query-builders/interfaces/IFetchResultQuery'

export declare interface QueryBuilder<Result>
  extends IBasicQuery,
    IConditionQuery,
    ISoftDeletesQuery,
    IFetchResultQuery<Result> {}

export declare interface Query<Result> {
  /**
   * Start new query with given name.
   * @param {string} name
   */
  queryName(name: string): QueryBuilder<this & T>

  /**
   * Set the columns or fields to be selected.
   *
   * @param {string|string[]} fields
   */
  select(...fields: Array<string | string[]>): QueryBuilder<this & T>

  // /**
  //  * Set the columns or fields to be applied distinct operation.
  //  * @param {string|string[]} fields
  //  */
  // distinct(...fields: Array<string | string[]>): QueryBuilder<this & T>

  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderBy(field: string): QueryBuilder<this & T>
  orderBy(field: string, direction: OrderDirection): QueryBuilder<this & T>

  /**
   * Add an "order by" clause to the query with direction ASC.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderByAsc(field: string): QueryBuilder<this & T>

  /**
   * Add an "order by" clause to the query with direction DESC.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderByDesc(field: string): QueryBuilder<this & T>

  /**
   * Set the "limit" value of the query.
   * @param {number} records
   */
  limit(records: number): QueryBuilder<this & T>

  /**
   * Add a basic where clause to the query.
   *
   * @param {Function} conditionBuilder sub-query builder
   */
  where(conditionBuilder: SubCondition): QueryBuilder<this & T>
  /**
   * Add a basic where clause to the query.
   *
   * @param {string} field
   * @param {mixed} value
   */
  where(field: string, value: any): QueryBuilder<this & T>
  /**
   * Add a basic where clause to the query.
   *
   * @param {string} field
   * @param {string} operator
   * @param {mixed} value
   */
  where(field: string, operator: Operator, value: any): QueryBuilder<this & T>

  /**
   * Add an "or where" clause to the query.
   *
   * @param {Function} conditionBuilder
   */
  orWhere(conditionBuilder: SubCondition): QueryBuilder<this & T>
  /**
   * Add an "or where" clause to the query.
   *
   * @param {string} field
   * @param {mixed} value
   */
  orWhere(field: string, value: any): QueryBuilder<this & T>
  /**
   * Add an "or where" clause to the query.
   *
   * @param {string} field
   * @param {string} operator
   * @param {mixed} value
   */
  orWhere(field: string, operator: Operator, value: any): QueryBuilder<this & T>

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  whereIn(field: string, values: Array<any>): QueryBuilder<this & T>

  /**
   * Add a "where not in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  whereNotIn(field: string, values: Array<any>): QueryBuilder<this & T>

  /**
   * Add an "or where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  orWhereIn(field: string, values: Array<any>): QueryBuilder<this & T>

  /**
   * Add an "or where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  orWhereNotIn(field: string, values: Array<any>): QueryBuilder<this & T>

  /**
   * Add a "where null" clause to the query.
   *
   * @param {string} field
   */
  whereNull(field: string): QueryBuilder<this & T>

  /**
   * Add a "where null" clause to the query.
   *
   * @param {string} field
   */
  whereNotNull(field: string): QueryBuilder<this & T>

  /**
   * Add an "or where null" clause to the query.
   *
   * @param {string} field
   */
  orWhereNull(field: string): QueryBuilder<this & T>

  /**
   * Add an "or where not null" clause to the query.
   *
   * @param {string} field
   */
  orWhereNotNull(field: string): QueryBuilder<this & T>

  /**
   * Consider all soft-deleted or not-deleted items.
   */
  withTrashed(): QueryBuilder<this & T>

  /**
   * Consider soft-deleted items only.
   */
  onlyTrashed(): QueryBuilder<this & T>

  /**
   * Execute the query and return a Collection.
   */
  all(): Promise<Collection<this & T>>

  /**
   * Execute the query and return a Collection.
   */
  get(): Promise<Collection<this & T>>

  /**
   * Execute the query and return a Eloquent instance.
   */
  first(): Promise<this & T>

  /**
   * Get an array with the values of a given column.
   *
   * @param {string} field
   */
  pluck(field: string): Promise<Object>
  /**
   * Get an array with the values of a given column.
   *
   * @param {string} field
   * @param {string} key
   */
  pluck(value: string, key: string): Promise<Object>

  /**
   * Retrieve the "count" result of the query.
   */
  count(): Promise<Number>
}
