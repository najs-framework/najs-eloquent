import { make } from 'najs-binding'
import { range, flatten, isFunction, isPlainObject } from 'lodash'
import collect from 'collect.js'
import { ChanceFaker } from './FactoryManager'
import { Eloquent } from '../model/Eloquent'
import { IFactoryBuilder, IFactoryBuilderCollection } from './interfaces/IFactoryBuilder'
import { Collection } from 'collect.js'

export class FactoryBuilder<T extends Eloquent> implements IFactoryBuilder<T> {
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

  times(amount: number): IFactoryBuilderCollection<T> {
    this.amount = amount

    return this
  }

  states(state: string): this
  states(states: string[]): this
  states(...state: string[]): this
  states(...states: Array<string[]>): this
  states(...states: any[]): this {
    this.activeStates = !this.activeStates ? flatten(states) : this.activeStates.concat(flatten(states))

    return this
  }

  async create<T>(): Promise<T>
  async create<T>(attributes: Object): Promise<T>
  async create(attributes?: Object): Promise<any> {
    const result = this.make<T>(<any>attributes)

    if (result instanceof Eloquent) {
      await result['save']()
      return result
    }

    return (result as Collection<T>).each(async (item: Eloquent) => {
      await item['save']()
    })
  }

  make<T>(): T
  make<T>(attributes: Object): T
  make(attributes?: Object): any {
    if (typeof this.amount === 'undefined') {
      return this.makeInstance(attributes)
    }

    if (this.amount < 1) {
      return make<Eloquent>(this.className, []).newCollection([])
    }

    return make<Eloquent>(this.className, []).newCollection(
      range(0, this.amount).map((item: any) => this.getRawAttributes(attributes))
    )
  }

  raw<T>(): T
  raw<T>(attributes: Object): T
  raw(attributes?: Object): any {
    if (typeof this.amount === 'undefined') {
      return this.getRawAttributes(attributes)
    }

    if (this.amount < 1) {
      return collect([])
    }

    return collect(range(0, this.amount).map((item: any) => this.getRawAttributes(attributes)))
  }

  protected makeInstance(attributes?: Object): any {
    // The false value is isGuarded
    return make(this.className, [this.getRawAttributes(attributes), false])
  }

  protected getRawAttributes(attributes?: Object): any {
    if (!this.definitions[this.className] || !isFunction(this.definitions[this.className][this.name])) {
      throw new ReferenceError(`Unable to locate factory with name [${this.name}] [${this.className}].`)
    }

    const definition: Object = Reflect.apply(this.definitions[this.className][this.name], undefined, [
      this.faker,
      attributes
    ])
    return this.triggerReferenceAttributes(Object.assign(this.applyStates(definition, attributes), attributes))
  }

  protected applyStates(definition: Object, attributes?: Object): Object {
    if (typeof this.activeStates === 'undefined') {
      return definition
    }

    for (const state of this.activeStates) {
      if (!this.definedStates[this.className] || !isFunction(this.definedStates[this.className][state])) {
        throw new ReferenceError(`Unable to locate [${state}] state for [${this.className}].`)
      }

      Object.assign(
        definition,
        Reflect.apply(this.definedStates[this.className][state], undefined, [this.faker, attributes])
      )
    }
    return definition
  }

  protected triggerReferenceAttributes(attributes: Object): Object {
    for (const name in attributes) {
      if (isFunction(attributes[name])) {
        attributes[name] = attributes[name].call(undefined, attributes)
      }

      if (attributes[name] instanceof Eloquent) {
        attributes[name] = attributes[name].getPrimaryKey()
      }

      if (isPlainObject(attributes[name])) {
        this.triggerReferenceAttributes(attributes[name])
      }
    }
    return attributes
  }
}
