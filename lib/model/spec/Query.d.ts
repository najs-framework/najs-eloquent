import { IBasicQuery } from '../../query-builders/interfaces/IBasicQuery'
import { IConditionQuery } from '../../query-builders/interfaces/IConditionQuery'
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

  /**
   * Set the columns or fields to be applied distinct operation.
   * @param {string|string[]} fields
   */
  distinct(...fields: Array<string | string[]>): QueryBuilder<this & T>

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

  where(conditionBuilder: SubCondition): QueryBuilder<this & T>
  where(field: string, value: any): QueryBuilder<this & T>
  where(field: string, operator: Operator, value: any): QueryBuilder<this & T>

  orWhere(conditionBuilder: SubCondition): QueryBuilder<this & T>
  orWhere(field: string, value: any): QueryBuilder<this & T>
  orWhere(field: string, operator: Operator, value: any): QueryBuilder<this & T>

  whereIn(field: string, values: Array<any>): QueryBuilder<this & T>
  whereNotIn(field: string, values: Array<any>): QueryBuilder<this & T>

  orWhereIn(field: string, values: Array<any>): QueryBuilder<this & T>
  orWhereNotIn(field: string, values: Array<any>): QueryBuilder<this & T>

  whereNull(field: string): QueryBuilder<this & T>
  whereNotNull(field: string): QueryBuilder<this & T>

  orWhereNull(field: string): QueryBuilder<this & T>
  orWhereNotNull(field: string): QueryBuilder<this & T>

  withTrashed(): QueryBuilder<this & T>
  onlyTrashed(): QueryBuilder<this & T>

  all(): Promise<Collection<this & T>>

  get(): Promise<Collection<this & T>>

  first(): Promise<this & T>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  count(): Promise<Number>

  findById(id: any): Promise<this & T | null>

  findOrFail(id: any): Promise<this & T>
}
