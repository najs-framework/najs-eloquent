import { make } from 'najs-binding'
import { range, flatten } from 'lodash'
import collect from 'collect.js'
import { ChanceFaker } from './FactoryManager'
import { Eloquent } from '../model/Eloquent'

export class FactoryBuilder {
  protected className: string
  protected name: string
  protected definitions: Object
  protected definedStates: Object
  protected faker: ChanceFaker
  protected amount?: number
  protected activeStates?: string[]

  constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker) {
    this.className = className
    this.name = name
    this.definitions = definitions
    this.definedStates = states
    this.faker = faker
  }

  times(amount: number): this {
    this.amount = amount

    return this
  }

  states(state: string): this
  states(states: string[]): this
  states(...state: string[]): this
  states(...states: Array<string[]>): this
  states(...states: any[]): this {
    this.activeStates = flatten(states)

    return this
  }

  async create<T = any>(): Promise<T>
  async create<T = any>(attributes: Object): Promise<T>
  async create<T = any>(attributes?: Object): Promise<T> {
    const result = this.make(<any>attributes)

    if (result instanceof Eloquent) {
      await result['save']()
    } else {
      result.each(async (item: Eloquent) => {
        await item['save']()
      })
    }

    return result
  }

  make<T = any>(): T
  make<T = any>(attributes: Object): T
  make(attributes?: Object): any {
    if (typeof this.amount === 'undefined') {
      return this.makeInstance(attributes)
    }

    if (this.amount < 1) {
      return make<Eloquent>(this.className, []).newCollection([])
    }

    return make<Eloquent>(this.className, []).newCollection(
      range(0, this.amount).map((item: any) => this.makeInstance(attributes))
    )
  }

  raw<T = any>(): T
  raw<T = any>(attributes: Object): T
  raw(attributes?: Object): any {
    if (typeof this.amount === 'undefined') {
      return this.getRawAttributes(attributes)
    }

    if (this.amount < 1) {
      return collect([])
    }

    return collect(range(0, this.amount).map((item: any) => this.getRawAttributes(attributes)))
  }

  protected makeInstance(attribute?: Object): any {}

  protected getRawAttributes(attribute?: Object): any {}
}
