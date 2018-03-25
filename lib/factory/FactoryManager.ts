import { Facade } from 'najs-facade'
import { FactoryBuilder } from './FactoryBuilder'
import { register, IAutoload } from 'najs-binding'
import { Chance } from 'chance'
import { NajsEloquentClass } from '../constants'
import { IFactoryBuilder } from './interfaces/IFactoryBuilder'
import { IFactoryManager, FactoryDefinition } from './interfaces/IFactoryManager'

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

  private initBagIfNeeded(name: string, className: string) {
    if (!this[name][className]) {
      this[name][className] = {}
    }
  }

  define(className: string, definition: FactoryDefinition<ChanceFaker>, name: string = 'default'): this {
    this.initBagIfNeeded('definitions', className)
    this.definitions[className][name] = definition
    return this
  }

  defineAs(className: string, name: string, definition: FactoryDefinition<ChanceFaker>): this {
    return this.define(className, definition, name)
  }

  state(className: string, state: string, definition: FactoryDefinition<ChanceFaker>): this {
    this.initBagIfNeeded('states', className)
    this.states[className][state] = definition
    return this
  }

  of(className: string): IFactoryBuilder
  of(className: string, name: string): IFactoryBuilder
  of(className: string, name: string = 'default'): IFactoryBuilder {
    return new FactoryBuilder(className, name, this.definitions, this.states, this.faker)
  }

  create<T>(className: string): T
  create<T>(className: string, attributes: Object): T
  create(className: any): any {
    return this.of(className).create(arguments[1])
  }

  createAs<T>(className: string, name: string): T
  createAs<T>(className: string, name: string, attributes: Object): T
  createAs(className: any, name: any): any {
    return this.of(className, name).create(arguments[2])
  }

  make<T>(className: string): T
  make<T>(className: string, attributes: Object): T
  make(className: string): any {
    return this.of(className).make(arguments[1])
  }

  makeAs<T>(className: string, name: string): T
  makeAs<T>(className: string, name: string, attributes: Object): T
  makeAs(className: string, name: string): any {
    return this.of(className, name).make(arguments[2])
  }

  raw<T>(className: string): T
  raw<T>(className: string, attributes: Object): T
  raw(className: string): any {
    return this.of(className).raw(arguments[1])
  }

  rawOf<T>(className: string, name: string): T
  rawOf<T>(className: string, name: string, attributes: Object): T
  rawOf(className: string, name: string): any {
    return this.of(className, name).raw(arguments[2])
  }
}
register(FactoryManager)
