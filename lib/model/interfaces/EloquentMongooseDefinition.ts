import { Collection } from 'collect.js'
import { Eloquent } from '../Eloquent'
import { OrderDirection } from '../../query-builders/interfaces/IBasicQuery'
import { SubCondition } from '../../query-builders/interfaces/IConditionQuery'
import { MongooseQueryBuilder } from '../../query-builders/mongodb/MongooseQueryBuilder'

export type EloquentMongooseDefinition<Attr, Class> = {
  new (): Eloquent<Attr> & Attr
  new (data: Object): Eloquent<Attr> & Attr

  Class<ChildAttr, ChildClass>(): EloquentMongooseDefinition<Class & ChildAttr, Class & ChildClass>

  queryName(name: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  select(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  select(fields: string[]): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  select(...fields: Array<string | string[]>): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  distinct(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  distinct(fields: string[]): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  distinct(...fields: Array<string | string[]>): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orderBy(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  orderBy(field: string, direction: OrderDirection): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orderByAsc(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orderByDesc(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  limit(records: number): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  where(conditionBuilder: SubCondition): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  where(field: string, value: any): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  where(field: string, operator: Operator, value: any): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orWhere(conditionBuilder: SubCondition): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  orWhere(field: string, value: any): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>
  orWhere(field: string, operator: Operator, value: any): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  whereIn(field: string, values: Array<any>): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  whereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orWhereIn(field: string, values: Array<any>): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orWhereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  whereNull(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  whereNotNull(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orWhereNull(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  orWhereNotNull(field: string): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  withTrashed(): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  onlyTrashed(): MongooseQueryBuilder<Eloquent<Attr> & Attr & Class>

  all(): Promise<Collection<Eloquent<Attr> & Attr & Class>>

  get(): Promise<Collection<Eloquent<Attr> & Attr & Class>>
  get(field: string): Promise<Collection<Eloquent<Attr> & Attr & Class>>
  get(fields: string[]): Promise<Collection<Eloquent<Attr> & Attr & Class>>
  get(...fields: Array<string | string[]>): Promise<Collection<Eloquent<Attr> & Attr & Class>>

  find(): Promise<Eloquent<Attr> & Attr & Class>
  find(id: any): Promise<Eloquent<Attr> & Attr & Class>

  first(): Promise<Eloquent<Attr> & Attr & Class>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  count(): Promise<Number>

  findById(id: any): Promise<Eloquent<Attr> & Attr & Class>

  findOrFail(id: any): Promise<Eloquent<Attr> & Attr & Class>
}
