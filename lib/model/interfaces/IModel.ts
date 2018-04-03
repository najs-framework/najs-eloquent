export interface IModel {
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

  is(model: IModel): boolean
}
