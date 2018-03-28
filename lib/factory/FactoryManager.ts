import { Facade } from 'najs-facade'
import { register, IAutoload, getClassName } from 'najs-binding'
import { Eloquent } from '../model/Eloquent'
import { FactoryBuilder } from './FactoryBuilder'
import { Chance } from 'chance'
import { NajsEloquentClass } from '../constants'
import { IFactoryBuilder } from './interfaces/IFactoryBuilder'
import { IFactoryManager, FactoryDefinition, ModelClass } from './interfaces/IFactoryManager'

export type ChanceFaker = Chance.Chance

export class FactoryManager extends Facade implements IAutoload, IFactoryManager<ChanceFaker> {
  static className: string = NajsEloquentClass.FactoryManager

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
    return NajsEloquentClass.FactoryManager
  }

  protected initBagIfNeeded(name: string, className: string) {
    if (!this[name][className]) {
      this[name][className] = {}
    }
  }

  private parseModelName(className: string | ModelClass): string {
    if (typeof className === 'function') {
      Eloquent.register(<any>className)
      return getClassName(className)
    }
    return className
  }

  define(className: string | ModelClass, definition: FactoryDefinition<ChanceFaker>, name: string = 'default'): this {
    const modelName = this.parseModelName(className)
    this.initBagIfNeeded('definitions', modelName)
    this.definitions[modelName][name] = definition
    return this
  }

  defineAs(className: string | ModelClass, name: string, definition: FactoryDefinition<ChanceFaker>): this {
    return this.define(className, definition, name)
  }

  state(className: string | ModelClass, state: string, definition: FactoryDefinition<ChanceFaker>): this {
    const modelName = this.parseModelName(className)
    this.initBagIfNeeded('states', modelName)
    this.states[modelName][state] = definition
    return this
  }

  of(className: string | ModelClass): IFactoryBuilder
  of(className: string | ModelClass, name: string): IFactoryBuilder
  of(className: string | ModelClass, name: string = 'default'): IFactoryBuilder {
    return new FactoryBuilder(this.parseModelName(className), name, this.definitions, this.states, this.faker)
  }

  create<T>(className: string | ModelClass): T
  create<T>(className: string | ModelClass, attributes: Object): T
  create(className: any): any {
    return this.of(className).create(arguments[1])
  }

  createAs<T>(className: string | ModelClass, name: string): T
  createAs<T>(className: string | ModelClass, name: string, attributes: Object): T
  createAs(className: any, name: any): any {
    return this.of(className, name).create(arguments[2])
  }

  make<T>(className: string | ModelClass): T
  make<T>(className: string | ModelClass, attributes: Object): T
  make(className: any): any {
    return this.of(className).make(arguments[1])
  }

  makeAs<T>(className: string | ModelClass, name: string): T
  makeAs<T>(className: string | ModelClass, name: string, attributes: Object): T
  makeAs(className: any, name: string): any {
    return this.of(className, name).make(arguments[2])
  }

  raw<T>(className: string | ModelClass): T
  raw<T>(className: string | ModelClass, attributes: Object): T
  raw(className: any): any {
    return this.of(className).raw(arguments[1])
  }

  rawOf<T>(className: string | ModelClass, name: string): T
  rawOf<T>(className: string | ModelClass, name: string, attributes: Object): T
  rawOf(className: any, name: string): any {
    return this.of(className, name).raw(arguments[2])
  }
}
register(FactoryManager)
