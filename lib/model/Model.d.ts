import { Collection } from 'collect.js'
export declare class Model {
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

  is(model: Model): boolean

  fireEvent(event: string): this

  newQuery(): any
  newInstance(data: Object | undefined): any
  newCollection(dataset: any[]): Collection<Model>
}
