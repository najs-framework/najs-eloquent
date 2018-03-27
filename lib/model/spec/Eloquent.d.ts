import { Collection } from 'collect.js'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata'

export declare class Eloquent<T> {
  // --- BUILD-CUT-START ---
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
  // --- BUILD-CUT-END ---
}
