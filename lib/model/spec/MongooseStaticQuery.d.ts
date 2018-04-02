import { Eloquent } from '../Eloquent'
import { MongooseQueryBuilder } from '../../query-builders/mongodb/MongooseQueryBuilder'
import { OrderDirection } from '../../query-builders/interfaces/IBasicQuery'
import { SubCondition } from '../../query-builders/interfaces/IConditionQuery'

export declare interface MongooseStaticQuery<Result> {
  /**
   * Start new query with given name.
   * @param {string} name
   */
  queryName(name: string): MongooseQueryBuilder<Result>

  /**
   * Set the columns or fields to be selected.
   *
   * @param {string|string[]} fields
   */
  select(...fields: Array<string | string[]>): MongooseQueryBuilder<Result>

  // distinct(field: string): MongooseQueryBuilder<Result>
  // distinct(fields: string[]): MongooseQueryBuilder<Result>
  // distinct(...fields: Array<string | string[]>): MongooseQueryBuilder<Result>

  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   */
  orderBy(field: string): MongooseQueryBuilder<Result>
  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderBy(field: string, direction: OrderDirection): MongooseQueryBuilder<Result>

  /**
   * Add an "order by" clause to the query with direction ASC.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderByAsc(field: string): MongooseQueryBuilder<Result>

  /**
   * Add an "order by" clause to the query with direction DESC.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderByDesc(field: string): MongooseQueryBuilder<Result>

  /**
   * Set the "limit" value of the query.
   * @param {number} records
   */
  limit(records: number): MongooseQueryBuilder<Result>

  /**
   * Add a basic where clause to the query.
   *
   * @param {Function} conditionBuilder sub-query builder
   */
  where(conditionBuilder: SubCondition): MongooseQueryBuilder<Result>
  /**
   * Add a basic where clause to the query.
   *
   * @param {string} field
   * @param {mixed} value
   */
  where(field: string, value: any): MongooseQueryBuilder<Result>
  /**
   * Add a basic where clause to the query.
   *
   * @param {string} field
   * @param {string} operator
   * @param {mixed} value
   */
  where(field: string, operator: Operator, value: any): MongooseQueryBuilder<Result>

  /**
   * Add an "or where" clause to the query.
   *
   * @param {Function} conditionBuilder
   */
  orWhere(conditionBuilder: SubCondition): MongooseQueryBuilder<Result>
  /**
   * Add an "or where" clause to the query.
   *
   * @param {string} field
   * @param {mixed} value
   */
  orWhere(field: string, value: any): MongooseQueryBuilder<Result>
  /**
   * Add an "or where" clause to the query.
   *
   * @param {string} field
   * @param {string} operator
   * @param {mixed} value
   */
  orWhere(field: string, operator: Operator, value: any): MongooseQueryBuilder<Result>

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  whereIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  /**
   * Add a "where not in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  whereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  /**
   * Add an "or where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  orWhereIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  /**
   * Add an "or where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  orWhereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  /**
   * Add a "where null" clause to the query.
   *
   * @param {string} field
   */
  whereNull(field: string): MongooseQueryBuilder<Result>

  /**
   * Add a "where null" clause to the query.
   *
   * @param {string} field
   */
  whereNotNull(field: string): MongooseQueryBuilder<Result>

  /**
   * Add an "or where null" clause to the query.
   *
   * @param {string} field
   */
  orWhereNull(field: string): MongooseQueryBuilder<Result>

  /**
   * Add an "or where not null" clause to the query.
   *
   * @param {string} field
   */
  orWhereNotNull(field: string): MongooseQueryBuilder<Result>

  /**
   * Consider all soft-deleted or not-deleted items.
   */
  withTrashed(): MongooseQueryBuilder<Result>

  /**
   * Consider soft-deleted items only.
   */
  onlyTrashed(): MongooseQueryBuilder<Result>

  /**
   * Execute the query and return a Collection.
   */
  all(): Promise<Collection<Result>>

  /**
   * Execute the query and return a Collection.
   */
  get(): Promise<Collection<Result>>

  /**
   * Execute the query and return a Eloquent instance.
   */
  find(): Promise<Result>
  // TODO: here
  find(id: any): Promise<Result>

  /**
   * Execute the query and return a Eloquent instance.
   */
  first(): Promise<Result>

  /**
   * Get an array with the values of a given column.
   *
   * @param {string} field
   */
  pluck(value: string): Promise<Object>
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

  findById(id: any): Promise<Result>

  findOrFail(id: any): Promise<Result>
}
