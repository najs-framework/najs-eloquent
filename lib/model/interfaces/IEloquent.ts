export interface IEloquent {
  id: any

  getClassName(): string

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

  is(model: IEloquent): boolean
}
