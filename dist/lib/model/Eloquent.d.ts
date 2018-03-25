import { Collection } from 'collect.js'
export declare class Eloquent<T> {
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

  getId(): any
  setId(id: any): void

  toObject(): Object
  toJSON(): Object
  toJson(): Object

  is(model: Eloquent): boolean

  fireEvent(event: string): this

  // Active Records functions ------------------------------------------------------------------------------------------
  touch(): this
  async save(): Promise<any>
  async delete(): Promise<any>
  async forceDelete(): Promise<any>
  async restore(): Promise<any>
  async fresh(): Promise<this>
}
