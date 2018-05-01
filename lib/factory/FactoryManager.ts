/// <reference types="chance" />

import { Facade } from 'najs-facade'
import { register, IAutoload, getClassName } from 'najs-binding'
import { Eloquent } from '../model/Eloquent'
import { FactoryBuilder } from './FactoryBuilder'
import { Chance } from 'chance'
import { NajsEloquent } from '../constants'
import { IFactoryBuilder } from './interfaces/IFactoryBuilder'
import { IFactoryManager, IFactoryDefinition, ModelClass } from './interfaces/IFactoryManager'

export type ChanceFaker = Chance.Chance

export class FactoryManager extends Facade implements IAutoload, IFactoryManager<ChanceFaker> {
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

  private parseModelName(className: string | ModelClass<Eloquent>): string {
    if (typeof className === 'function') {
      Eloquent.register(<any>className)
      return getClassName(className)
    }
    return className
  }

  define(
    className: string | ModelClass<Eloquent>,
    definition: IFactoryDefinition<ChanceFaker>,
    name: string = 'default'
  ): this {
    return this.addDefinition('definitions', className, name, definition)
  }

  defineAs(className: string | ModelClass<Eloquent>, name: string, definition: IFactoryDefinition<ChanceFaker>): this {
    return this.define(className, definition, name)
  }

  state(className: string | ModelClass<Eloquent>, state: string, definition: IFactoryDefinition<ChanceFaker>): this {
    return this.addDefinition('states', className, state, definition)
  }

  of<T>(className: string | ModelClass<T>): IFactoryBuilder<T>
  of<T>(className: string | ModelClass<T>, name: string): IFactoryBuilder<T>
  of(className: string | ModelClass<any>, name: string = 'default'): IFactoryBuilder<any> {
    return new FactoryBuilder(this.parseModelName(className), name, this.definitions, this.states, this.faker)
  }

  create<T>(className: string | ModelClass<T>): T
  create<T>(className: string | ModelClass<T>, attributes: Object): T
  create(className: any): any {
    return this.of(className).create(arguments[1])
  }

  createAs<T>(className: string | ModelClass<T>, name: string): T
  createAs<T>(className: string | ModelClass<T>, name: string, attributes: Object): T
  createAs(className: any, name: any): any {
    return this.of(className, name).create(arguments[2])
  }

  make<T>(className: string | ModelClass<T>): T
  make<T>(className: string | ModelClass<T>, attributes: Object): T
  make(className: any): any {
    return this.of(className).make(arguments[1])
  }

  makeAs<T>(className: string | ModelClass<T>, name: string): T
  makeAs<T>(className: string | ModelClass<T>, name: string, attributes: Object): T
  makeAs(className: any, name: string): any {
    return this.of(className, name).make(arguments[2])
  }

  raw<T>(className: string | ModelClass<T>): T
  raw<T>(className: string | ModelClass<T>, attributes: Object): T
  raw(className: any): any {
    return this.of(className).raw(arguments[1])
  }

  rawOf<T>(className: string | ModelClass<T>, name: string): T
  rawOf<T>(className: string | ModelClass<T>, name: string, attributes: Object): T
  rawOf(className: any, name: string): any {
    return this.of(className, name).raw(arguments[2])
  }
}
register(FactoryManager)
