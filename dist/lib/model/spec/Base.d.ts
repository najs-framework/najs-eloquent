import { Collection } from 'collect.js'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata'

export declare class Base<Record> {
  /**
   * The model's attributes.
   */
  protected attributes: Record

  /**
   * The driver associated with the model.
   */
  protected driver: IEloquentDriver<Record>

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

  /**
   * Get an attribute from the model.
   * @param {string} attribute
   */
  getAttribute(attribute: string): any

  /**
   * Set a given attribute on the model.
   *
   * @param {string} attribute
   * @param {any} value
   */
  setAttribute(attribute: string, value: any): boolean

  /**
   * Get the primary key for the model.
   */
  getId(): any

  /**
   * Set the primary key for the model.
   *
   * @param {any} id
   */
  setId(id: any): void

  /**
   * Add temporary fillable attributes for current instance.
   *
   * @param {string|string[]} keys
   */
  markFillable(...keys: Array<string | string[]>): this

  /**
   * Add temporary guarded attributes for current instance.
   *
   * @param {string|string[]} keys
   */
  markGuarded(...keys: Array<string | string[]>): this

  /**
   * Add temporary visible attributes for current instance.
   *
   * @param {string|string[]} keys
   */
  markVisible(...keys: Array<string | string[]>): this

  /**
   * Add temporary hidden attributes for current instance.
   *
   * @param {string|string[]} keys
   */
  markHidden(...keys: Array<string | string[]>): this

  /**
   * Convert the model instance to a plain object, visible and hidden are not applied.
   */
  toObject(): Object

  /**
   * Convert the model instance to JSON object.
   */
  toJSON(): Object

  /**
   * Convert the model instance to JSON object.
   */
  toJson(): Object

  /**
   * Determine if two models have the same ID and belong to the same table/collection.
   * @param {Model} model
   */
  is(model: Eloquent<T>): boolean

  // fireEvent(event: string): this

  // Active Records functions ------------------------------------------------------------------------------------------

  /**
   * Update the model's update timestamp.
   */
  touch(): this

  /**
   * Save the model to the database.
   */
  save(): Promise<any>

  /**
   * Delete the model from the database.
   */
  delete(): Promise<any>

  /**
   * Force a hard delete on a soft deleted model.
   */
  forceDelete(): Promise<any>

  /**
   * Restore a soft deleted model.
   */
  restore(): Promise<any>

  /**
   * Reload a fresh model instance from the database.
   */
  fresh(): Promise<this | null>
}
