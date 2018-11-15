/// <reference path="../contracts/FactoryBuilder.ts" />
/// <reference path="../definitions/collect.js/index.d.ts" />

import { register, make } from 'najs-binding'
import { range, flatten, isFunction, isPlainObject } from 'lodash'
import collect from 'collect.js'
import { ChanceFaker } from './FactoryManager'
import { Model } from '../model/Model'
import { NajsEloquent as NajsEloquentClasses } from '../constants'
import { make_collection } from '../util/factory'

export interface FactoryBuilder<T extends Model> extends Najs.Contracts.Eloquent.FactoryBuilder<T> {}
export class FactoryBuilder<T extends Model> {
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

  getClassName() {
    return NajsEloquentClasses.Factory.FactoryBuilder
  }

  times(amount: number): any {
    this.amount = amount

    return this
  }

  states(...states: any[]): this {
    this.activeStates = !this.activeStates ? flatten(states) : this.activeStates.concat(flatten(states))

    return this
  }

  async create(attributes?: Object): Promise<any> {
    const result = this.make(<any>attributes)

    if (result instanceof Model) {
      await result.save()
      return result
    }

    return (result as CollectJs.Collection<T>).each(async (item: Model) => {
      await item.save()
    })
  }

  make(attributes?: Object): any {
    if (typeof this.amount === 'undefined') {
      return this.makeModelInstance(attributes)
    }

    if (this.amount < 1) {
      return make_collection([])
    }

    return make_collection(range(0, this.amount), item => this.makeModelInstance(attributes))
  }

  raw(attributes?: Object): any {
    if (typeof this.amount === 'undefined') {
      return this.getRawAttributes(attributes)
    }

    if (this.amount < 1) {
      return collect([])
    }

    return collect(range(0, this.amount).map((item: any) => this.getRawAttributes(attributes)))
  }

  makeModelInstance(attributes?: Object): any {
    return make(this.className, [this.getRawAttributes(attributes), false])
  }

  getRawAttributes(attributes?: Object): any {
    if (!this.definitions[this.className] || !isFunction(this.definitions[this.className][this.name])) {
      throw new ReferenceError(`Unable to locate factory with name [${this.name}] [${this.className}].`)
    }

    const definition: Object = Reflect.apply(this.definitions[this.className][this.name], undefined, [
      this.faker,
      attributes
    ])
    return this.triggerReferenceAttributes(Object.assign(this.applyStates(definition, attributes), attributes))
  }

  applyStates(definition: Object, attributes?: Object): Object {
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

  triggerReferenceAttributes(attributes: Object): Object {
    for (const name in attributes) {
      if (isFunction(attributes[name])) {
        attributes[name] = attributes[name].call(undefined, attributes)
      }

      if (attributes[name] instanceof Model) {
        attributes[name] = attributes[name].getPrimaryKey()
      }

      if (isPlainObject(attributes[name])) {
        this.triggerReferenceAttributes(attributes[name])
      }
    }
    return attributes
  }
}
register(FactoryBuilder, NajsEloquentClasses.Factory.FactoryBuilder)
