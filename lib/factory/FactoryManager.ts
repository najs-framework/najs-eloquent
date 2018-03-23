import { FactoryBuilder } from './FactoryBuilder'
import { register, IAutoload } from 'najs-binding'
import { Chance } from 'chance'
import { NajsEloquentClass } from '../constants'
import { IFactoryBuilder } from './interfaces/IFactoryBuilder'
import { IFactoryManager, FactoryDefinition } from './interfaces/IFactoryManager'

export type ChanceFaker = Chance.Chance

export class FactoryManager implements IAutoload, IFactoryManager<ChanceFaker> {
  protected faker: ChanceFaker
  protected definitions = {}
  protected states = {}

  constructor() {
    this.faker = new Chance()
  }

  getClassName() {
    return NajsEloquentClass.MongooseProvider
  }

  define(className: string, definition: FactoryDefinition<ChanceFaker>, name: string = 'default'): this {
    if (!this.definitions[className]) {
      this.definitions[className] = {}
    }
    this.definitions[className][name] = definition
    return this
  }

  defineAs(className: string, name: string, definition: FactoryDefinition<ChanceFaker>): this {
    return this.define(className, definition, name)
  }

  state(className: string, state: string, definition: FactoryDefinition<ChanceFaker>): this {
    if (!this.states[className]) {
      this.states[className] = {}
    }
    this.states[className][state] = definition
    return this
  }

  of(className: string): IFactoryBuilder
  of(className: string, name: string): IFactoryBuilder
  of(className: string, name: string = 'default'): IFactoryBuilder {
    // TODO: remove any in here
    return <any>new FactoryBuilder(className, name, this.definitions, this.states, this.faker)
  }

  create<T = any>(className: string): Promise<T>
  create<T = any>(className: string, attributes: Object): Promise<T>
  create<T = any>(className: string, attributes?: Object): Promise<T> {
    return this.of(className).create(<any>attributes)
  }

  createAs<T = any>(className: string, name: string): Promise<T>
  createAs<T = any>(className: string, name: string, attributes: Object): Promise<T>
  createAs<T = any>(className: string, name: string, attributes?: Object): Promise<T> {
    return this.of(className, name).create(<any>attributes)
  }

  make<T = any>(className: string): T
  make<T = any>(className: string, attributes: Object): T
  make<T = any>(className: string, attributes?: Object): T {
    return this.of(className).make(<any>attributes)
  }

  makeAs<T = any>(className: string, name: string): T
  makeAs<T = any>(className: string, name: string, attributes: Object): T
  makeAs<T = any>(className: string, name: string, attributes?: Object): T {
    return this.of(className, name).make(<any>attributes)
  }

  raw<T = any>(className: string): T
  raw<T = any>(className: string, attributes: Object): T
  raw<T = any>(className: string, attributes?: Object): T {
    return this.of(className).raw(<any>attributes)
  }

  rawOf<T = any>(className: string, name: string): T
  rawOf<T = any>(className: string, name: string, attributes: Object): T
  rawOf<T = any>(className: string, name: string, attributes?: Object): T {
    return this.of(className, name).raw(<any>attributes)
  }
}
register(FactoryManager)
