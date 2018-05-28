/// <reference path="../contracts/FactoryManager.ts" />
/// <reference path="../contracts/FactoryBuilder.ts" />
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference types="chance" />

import './FactoryBuilder'
import { Facade } from 'najs-facade'
import { register, make, getClassName } from 'najs-binding'
import { Eloquent } from '../model/Eloquent'
import { Chance } from 'chance'
import { NajsEloquent } from '../constants'

export type ChanceFaker = Chance.Chance

export class FactoryManager extends Facade implements Najs.Contracts.Eloquent.FactoryManager {
  static className: string = NajsEloquent.Factory.FactoryManager

  protected faker: ChanceFaker
  protected definitions: Object
  protected states: Object

  constructor() {
    super()
    this.faker = new Chance()
    this.definitions = {}
    this.states = {}
  }

  getClassName() {
    return NajsEloquent.Factory.FactoryManager
  }

  protected addDefinition(bag: string, className: any, name: string, definition: any) {
    const modelName = this.parseModelName(className)
    if (!this[bag][modelName]) {
      this[bag][modelName] = {}
    }
    this[bag][modelName][name] = definition
    return this
  }

  private parseModelName(className: string | { new (): any }): string {
    if (typeof className === 'function') {
      Eloquent.register(<any>className)
      return getClassName(className)
    }
    return className
  }

  define(
    className: string | { new (): any },
    definition: NajsEloquent.Factory.FactoryDefinition,
    name: string = 'default'
  ): this {
    return this.addDefinition('definitions', className, name, definition)
  }

  defineAs(
    className: string | { new (): any },
    name: string,
    definition: NajsEloquent.Factory.FactoryDefinition
  ): this {
    return this.define(className, definition, name)
  }

  state(className: string | { new (): any }, state: string, definition: NajsEloquent.Factory.FactoryDefinition): this {
    return this.addDefinition('states', className, state, definition)
  }

  of<T>(className: string | { new (): T }): Najs.Contracts.Eloquent.FactoryBuilder<T>
  of<T>(className: string | { new (): T }, name: string): Najs.Contracts.Eloquent.FactoryBuilder<T>
  of(className: string | { new (): any }, name: string = 'default'): Najs.Contracts.Eloquent.FactoryBuilder<any> {
    return make<Najs.Contracts.Eloquent.FactoryBuilder<any>>(NajsEloquent.Factory.FactoryBuilder, [
      this.parseModelName(className),
      name,
      this.definitions,
      this.states,
      this.faker
    ])
  }

  create<T>(className: string | { new (): T }): T
  create<T>(className: string | { new (): T }, attributes: Object): T
  create(className: any): any {
    return this.of(className).create(arguments[1])
  }

  createAs<T>(className: string | { new (): T }, name: string): T
  createAs<T>(className: string | { new (): T }, name: string, attributes: Object): T
  createAs(className: any, name: any): any {
    return this.of(className, name).create(arguments[2])
  }

  make<T>(className: string | { new (): T }): T
  make<T>(className: string | { new (): T }, attributes: Object): T
  make(className: any): any {
    return this.of(className).make(arguments[1])
  }

  makeAs<T>(className: string | { new (): T }, name: string): T
  makeAs<T>(className: string | { new (): T }, name: string, attributes: Object): T
  makeAs(className: any, name: string): any {
    return this.of(className, name).make(arguments[2])
  }

  raw<T>(className: string | { new (): T }): T
  raw<T>(className: string | { new (): T }, attributes: Object): T
  raw(className: any): any {
    return this.of(className).raw(arguments[1])
  }

  rawOf<T>(className: string | { new (): T }, name: string): T
  rawOf<T>(className: string | { new (): T }, name: string, attributes: Object): T
  rawOf(className: any, name: string): any {
    return this.of(className, name).raw(arguments[2])
  }
}
register(FactoryManager, NajsEloquent.Factory.FactoryManager)
