import { Collection } from 'collect.js'
export declare class Eloquent {
  id: any

  getClassName(): string

  fill(data: Object): this
  forceFill(data: Object): this

  getFillable(): string[]
  getGuarded(): string[]

  isFillable(key: string): boolean
  isGuarded(key: string): boolean

  setAttribute(attribute: string, value: any): boolean
  getAttribute(attribute: string): any

  toObject(): Object
  toJson(): Object

  is(model: Eloquent): boolean

  fireEvent(event: string): this
}
