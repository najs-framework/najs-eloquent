import { Eloquent } from '../Eloquent'
import { MongooseQueryBuilder } from '../../query-builders/mongodb/MongooseQueryBuilder'
import { OrderDirection } from '../../query-builders/interfaces/IBasicQuery'
import { SubCondition } from '../../query-builders/interfaces/IConditionQuery'

export declare interface MongooseStaticQuery<Result> {
  queryName(name: string): MongooseQueryBuilder<Result>

  select(field: string): MongooseQueryBuilder<Result>
  select(fields: string[]): MongooseQueryBuilder<Result>
  select(...fields: Array<string | string[]>): MongooseQueryBuilder<Result>

  distinct(field: string): MongooseQueryBuilder<Result>
  distinct(fields: string[]): MongooseQueryBuilder<Result>
  distinct(...fields: Array<string | string[]>): MongooseQueryBuilder<Result>

  orderBy(field: string): MongooseQueryBuilder<Result>
  orderBy(field: string, direction: OrderDirection): MongooseQueryBuilder<Result>

  orderByAsc(field: string): MongooseQueryBuilder<Result>

  orderByDesc(field: string): MongooseQueryBuilder<Result>

  limit(records: number): MongooseQueryBuilder<Result>

  where(conditionBuilder: SubCondition): MongooseQueryBuilder<Result>
  where(field: string, value: any): MongooseQueryBuilder<Result>
  where(field: string, operator: Operator, value: any): MongooseQueryBuilder<Result>

  orWhere(conditionBuilder: SubCondition): MongooseQueryBuilder<Result>
  orWhere(field: string, value: any): MongooseQueryBuilder<Result>
  orWhere(field: string, operator: Operator, value: any): MongooseQueryBuilder<Result>

  whereIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  whereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  orWhereIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  orWhereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<Result>

  whereNull(field: string): MongooseQueryBuilder<Result>

  whereNotNull(field: string): MongooseQueryBuilder<Result>

  orWhereNull(field: string): MongooseQueryBuilder<Result>

  orWhereNotNull(field: string): MongooseQueryBuilder<Result>

  withTrashed(): MongooseQueryBuilder<Result>

  onlyTrashed(): MongooseQueryBuilder<Result>

  all(): Promise<Collection<Result>>

  get(): Promise<Collection<Result>>
  get(field: string): Promise<Collection<Result>>
  get(fields: string[]): Promise<Collection<Result>>
  get(...fields: Array<string | string[]>): Promise<Collection<Result>>

  find(): Promise<Result>
  find(id: any): Promise<Result>

  first(): Promise<Result>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  count(): Promise<Number>

  findById(id: any): Promise<Result>

  findOrFail(id: any): Promise<Result>
}
