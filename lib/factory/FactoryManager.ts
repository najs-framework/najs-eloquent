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

export interface FactoryManager extends Najs.Contracts.Eloquent.FactoryManager {}
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

  of(className: string | { new (): any }, name: string = 'default'): Najs.Contracts.Eloquent.FactoryBuilder<any> {
    return make<Najs.Contracts.Eloquent.FactoryBuilder<any>>(NajsEloquent.Factory.FactoryBuilder, [
      this.parseModelName(className),
      name,
      this.definitions,
      this.states,
      this.faker
    ])
  }
}
// implicit implements partial of FactoryManager
const funcs = {
  create: 'create',
  createAs: 'create',
  make: 'make',
  makeAs: 'make',
  raw: 'raw',
  rawOf: 'raw'
}
for (const name in funcs) {
  const hasName = name !== funcs[name]
  FactoryManager.prototype[name] = function() {
    const builder = this.of(arguments[0], hasName ? arguments[1] : 'default')
    const second = arguments[hasName ? 2 : 1]
    const third = arguments[hasName ? 3 : 2]
    if (typeof second === 'number') {
      return builder.times(second)[funcs[name]](third)
    }
    return builder[funcs[name]](second)
  }
}

register(FactoryManager, NajsEloquent.Factory.FactoryManager)
