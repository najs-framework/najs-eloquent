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
  queryName(name: string): QueryBuilder<this & T>

  select(field: string): QueryBuilder<this & T>
  select(fields: string[]): QueryBuilder<this & T>
  select(...fields: Array<string | string[]>): QueryBuilder<this & T>

  distinct(field: string): QueryBuilder<this & T>
  distinct(fields: string[]): QueryBuilder<this & T>
  distinct(...fields: Array<string | string[]>): QueryBuilder<this & T>

  orderBy(field: string): QueryBuilder<this & T>
  orderBy(field: string, direction: OrderDirection): QueryBuilder<this & T>

  orderByAsc(field: string): QueryBuilder<this & T>

  orderByDesc(field: string): QueryBuilder<this & T>

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
