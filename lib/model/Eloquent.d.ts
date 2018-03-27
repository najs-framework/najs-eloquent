import { Collection } from 'collect.js'
import { MongooseQueryBuilder } from '../query-builders/mongodb/MongooseQueryBuilder'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { IEloquent } from './interfaces/IEloquent'
import { OrderDirection, IBasicQuery } from '../query-builders/interfaces/IBasicQuery'
import { SubCondition, IConditionQuery } from '../query-builders/interfaces/IConditionQuery'
import { ISoftDeletesQuery } from '../query-builders/interfaces/ISoftDeletesQuery'
import { IFetchResultQuery } from '../query-builders/interfaces/IFetchResultQuery'

export type EloquentQuery<Model> = IBasicQuery & IConditionQuery & ISoftDeletesQuery & IFetchResultQuery<Model>

export declare class Eloquent<T> implements IEloquent {
  /**
   * The model's attributes.
   */
  protected attributes: T

  /**
   * The driver associated with the model.
   */
  protected driver: IEloquentDriver<T>

  /**
   * The attributes that are mass assignable.
   */
  protected fillable?: string[]

  /**
   * The table associated with the model.
   */
  protected table: string

  /**
   * The primary key for the model.
   */
  id: any

  /**
   * Get class name of model.
   */
  getClassName(): string

  /**
   * Fill the model with an array of attributes.
   *
   * @param {Object} data
   */
  fill(data: Object): this

  forceFill(data: Object): this

  getFillable(): string[]
  getGuarded(): string[]
  isFillable(key: string): boolean
  isGuarded(key: string): boolean

  getVisible(): string[]
  getHidden(): string[]
  isVisible(key: string): boolean
  isHidden(key: string): boolean

  setAttribute(attribute: string, value: any): boolean
  getAttribute(attribute: string): any
  getId(): any
  setId(id: any): void

  markFillable(key: string): this
  markFillable(keys: string[]): this
  markFillable(...keys: Array<string>): this
  markFillable(...keys: Array<string[]>): this
  markFillable(...args: Array<string | string[]>): this

  markGuarded(key: string): this
  markGuarded(keys: string[]): this
  markGuarded(...keys: Array<string>): this
  markGuarded(...keys: Array<string[]>): this
  markGuarded(...args: Array<string | string[]>): this

  markVisible(key: string): this
  markVisible(keys: string[]): this
  markVisible(...keys: Array<string>): this
  markVisible(...keys: Array<string[]>): this
  markVisible(...args: Array<string | string[]>): this

  markHidden(key: string): this
  markHidden(keys: string[]): this
  markHidden(...keys: Array<string>): this
  markHidden(...keys: Array<string[]>): this
  markHidden(...args: Array<string | string[]>): this

  toObject(): Object
  toJSON(): Object
  toJson(): Object

  is(model: Eloquent<T>): boolean

  // fireEvent(event: string): this

  // Basic Query functions ---------------------------------------------------------------------------------------------
  queryName(name: string): EloquentQuery<this & T>

  select(field: string): EloquentQuery<this & T>
  select(fields: string[]): EloquentQuery<this & T>
  select(...fields: Array<string | string[]>): EloquentQuery<this & T>

  distinct(field: string): EloquentQuery<this & T>
  distinct(fields: string[]): EloquentQuery<this & T>
  distinct(...fields: Array<string | string[]>): EloquentQuery<this & T>

  orderBy(field: string): EloquentQuery<this & T>
  orderBy(field: string, direction: OrderDirection): EloquentQuery<this & T>

  orderByAsc(field: string): EloquentQuery<this & T>

  orderByDesc(field: string): EloquentQuery<this & T>

  limit(records: number): EloquentQuery<this & T>

  where(conditionBuilder: SubCondition): EloquentQuery<this & T>
  where(field: string, value: any): EloquentQuery<this & T>
  where(field: string, operator: Operator, value: any): EloquentQuery<this & T>

  orWhere(conditionBuilder: SubCondition): EloquentQuery<this & T>
  orWhere(field: string, value: any): EloquentQuery<this & T>
  orWhere(field: string, operator: Operator, value: any): EloquentQuery<this & T>

  whereIn(field: string, values: Array<any>): EloquentQuery<this & T>
  whereNotIn(field: string, values: Array<any>): EloquentQuery<this & T>

  orWhereIn(field: string, values: Array<any>): EloquentQuery<this & T>
  orWhereNotIn(field: string, values: Array<any>): EloquentQuery<this & T>

  whereNull(field: string): EloquentQuery<this & T>
  whereNotNull(field: string): EloquentQuery<this & T>

  orWhereNull(field: string): EloquentQuery<this & T>
  orWhereNotNull(field: string): EloquentQuery<this & T>

  withTrashed(): EloquentQuery<this & T>
  onlyTrashed(): EloquentQuery<this & T>

  all(): Promise<Collection<this & T>>

  get(): Promise<Collection<this & T>>

  first(): Promise<this & T>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  count(): Promise<Number>

  findById(id: any): Promise<this & T | null>

  findOrFail(id: any): Promise<this & T>

  // Active Records functions ------------------------------------------------------------------------------------------
  touch(): this
  save(): Promise<any>
  delete(): Promise<any>
  forceDelete(): Promise<any>
  restore(): Promise<any>
  fresh(): Promise<this>

  // Static functions --------------------------------------------------------------------------------------------------
  static register(model: Function | typeof Eloquent): void
}

export declare class EloquentMongoose<T> extends Eloquent<T> {}
