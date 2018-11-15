/// <reference path="../contracts/FactoryManager.ts" />
/// <reference path="../contracts/FactoryBuilder.ts" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/factory/IFactoryDefinition.ts" />
/// <reference types="chance" />

import ModelDefinition = NajsEloquent.Model.ModelDefinition
import IFactoryDefinition = NajsEloquent.Factory.IFactoryDefinition

import './FactoryBuilder'
import { Facade } from 'najs-facade'
import { register, make, getClassName } from 'najs-binding'
import { Chance } from 'chance'
import { NajsEloquent as NajsEloquentClasses } from '../constants'

export type ChanceFaker = Chance.Chance

export interface FactoryManager extends Najs.Contracts.Eloquent.FactoryManager {}
export class FactoryManager extends Facade implements Najs.Contracts.Eloquent.FactoryManager {
  static className: string = NajsEloquentClasses.Factory.FactoryManager

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
    return NajsEloquentClasses.Factory.FactoryManager
  }

  private addDefinition(bag: string, className: any, name: string, definition: any) {
    const modelName = this.getModelName(className)
    if (!this[bag][modelName]) {
      this[bag][modelName] = {}
    }
    this[bag][modelName][name] = definition
    return this
  }

  protected getModelName(className: ModelDefinition): string {
    if (typeof className === 'function') {
      return getClassName(className)
    }
    return className
  }

  define(className: ModelDefinition, definition: IFactoryDefinition, name: string = 'default'): this {
    return this.addDefinition('definitions', className, name, definition)
  }

  defineAs(className: ModelDefinition, name: string, definition: IFactoryDefinition): this {
    return this.define(className, definition, name)
  }

  state(className: ModelDefinition, state: string, definition: IFactoryDefinition): this {
    return this.addDefinition('states', className, state, definition)
  }

  of(className: ModelDefinition, name: string = 'default'): Najs.Contracts.Eloquent.FactoryBuilder<any> {
    return make<Najs.Contracts.Eloquent.FactoryBuilder<any>>(NajsEloquentClasses.Factory.FactoryBuilder, [
      this.getModelName(className),
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

register(FactoryManager, NajsEloquentClasses.Factory.FactoryManager)
