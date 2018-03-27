import { Collection } from 'collect.js'
import { MongooseQueryBuilder } from '../query-builders/mongodb/MongooseQueryBuilder'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { EloquentMongooseDefinition } from './interfaces/EloquentMongooseDefinition'
import { EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata'
import { OrderDirection, IBasicQuery } from '../query-builders/interfaces/IBasicQuery'
import { SubCondition, IConditionQuery } from '../query-builders/interfaces/IConditionQuery'
import { ISoftDeletesQuery } from '../query-builders/interfaces/ISoftDeletesQuery'
import { IFetchResultQuery } from '../query-builders/interfaces/IFetchResultQuery'

export type EloquentQuery<Model> = IBasicQuery & IConditionQuery & ISoftDeletesQuery & IFetchResultQuery<Model>

export declare class Eloquent<T extends Object = {}> {
  /**
   * The model's attributes.
   */
  protected attributes: T

  /**
   * The driver associated with the model.
   */
  protected driver: IEloquentDriver<T>

  /**
   * Temporary settings for current instance.
   */
  protected temporarySettings?: {
    /**
     * The attributes that are mass assignable for current instance.
     */
    fillable?: string[]
    /**
     * The attributes that aren't mass assignable for current instance.
     */
    guarded?: string[]
    /**
     * The attributes that should be visible in JSON for current instance.
     */
    visible?: string[]
    /**
     * The attributes that should be hidden for JSON for current instance.
     */
    hidden?: string[]
  }

  /**
   * The attributes that are mass assignable.
   */
  protected fillable?: string[]

  /**
   * The attributes that aren't mass assignable.
   */
  protected guarded?: string[]

  /**
   * The attributes that should be visible in JSON.
   */
  protected visible?: string[]

  /**
   * The attributes that should be hidden for JSON
   */
  protected hidden?: string[]

  /**
   * Indicates if the model should be timestamp-ed.
   */
  protected timestamps?: EloquentTimestamps | boolean

  /**
   * Indicates if the model should be soft-deleted.
   */
  protected softDeletes?: EloquentSoftDelete | boolean

  /**
   * The table associated with the model.
   */
  protected table?: string

  /**
   * The collection associated with the model.
   */
  protected collection?: string

  /**
   * The schema definitions associated with the model.
   */
  protected schema?: Object

  /**
   * The schema options associated with the model.
   */
  protected options?: Object

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

  /**
   * Fill the model with an array of attributes. Force mass assignment.
   *
   * @param {Object} data
   */
  forceFill(data: Object): this

  /**
   * Get the fillable attributes for the model.
   */
  getFillable(): string[]

  /**
   * Get the guarded attributes for the model.
   */
  getGuarded(): string[]

  /**
   * Determine if the given attribute may be mass assigned.
   *
   * @param {string} key
   */
  isFillable(key: string): boolean

  /**
   * Determine if the given key is guarded.
   *
   * @param {string} key
   */
  isGuarded(key: string): boolean

  /**
   * Get the visible attributes for the model.
   */
  getVisible(): string[]

  /**
   * Get the hidden attributes for the model.
   */
  getHidden(): string[]

  /**
   * Determine if the given attribute may be included in JSON.
   *
   * @param {string} key
   */
  isVisible(key: string): boolean

  /**
   * Determine if the given key hidden in JSON.
   *
   * @param {string} key
   */
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

  static Mongoose<Attribute, Class>(): EloquentMongooseDefinition<Attribute, Class>
}

export declare class EloquentMongoose<T> extends Eloquent<T> {}
