import { Collection } from 'collect.js'
import { EloquentMongoose } from '../eloquent/EloquentMongoose'
import { MongooseQueryBuilder } from '../query-builders/MongooseQueryBuilder'
import { OrderDirection, SubCondition } from '../interfaces/IBasicQueryGrammar'
import { Schema } from 'mongoose'

export type AbstractImplemented = {
  getSchema(): Schema
}

export type EloquentMongooseSpec<Attr, Class> = {
  new (): EloquentMongoose<Attr> & Attr
  new (data: Object): EloquentMongoose<Attr> & Attr

  Class<ChildAttr, ChildClass>(): EloquentMongooseSpec<Class & ChildAttr & AbstractImplemented, Class & ChildClass>

  queryName(name: string): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  select(field: string): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  select(fields: string[]): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  select(...fields: Array<string | string[]>): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  distinct(field: string): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  distinct(fields: string[]): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  distinct(...fields: Array<string | string[]>): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  orderBy(field: string): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  orderBy(field: string, direction: OrderDirection): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  orderByAsc(field: string): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  orderByDesc(field: string): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  limit(records: number): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  where(conditionBuilder: SubCondition): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  where(field: string, value: any): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  where(field: string, operator: Operator, value: any): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  orWhere(conditionBuilder: SubCondition): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  orWhere(field: string, value: any): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
  orWhere(field: string, operator: Operator, value: any): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  whereIn(field: string, values: Array<any>): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  whereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  orWhereIn(field: string, values: Array<any>): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  orWhereNotIn(field: string, values: Array<any>): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>

  all(): Promise<Collection<EloquentMongoose<Attr> & Attr & Class>>

  get(): Promise<Collection<EloquentMongoose<Attr> & Attr & Class>>
  get(field: string): Promise<Collection<EloquentMongoose<Attr> & Attr & Class>>
  get(fields: string[]): Promise<Collection<EloquentMongoose<Attr> & Attr & Class>>
  get(...fields: Array<string | string[]>): Promise<Collection<EloquentMongoose<Attr> & Attr & Class>>

  find(): Promise<EloquentMongoose<Attr> & Attr & Class>
  find(id: any): Promise<EloquentMongoose<Attr> & Attr & Class>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  findById(id: any): Promise<EloquentMongoose<Attr> & Attr & Class>

  findOrFail(id: any): Promise<EloquentMongoose<Attr> & Attr & Class>
}
