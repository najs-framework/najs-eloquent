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

  create(className: string, attributes?: Object): any {
    return this.of(className).create(<any>attributes)
  }

  createAs(className: string, name: string, attributes?: Object): any {
    return this.of(className, name).create(<any>attributes)
  }

  make(className: string, attributes?: Object): any {
    return this.of(className).make(<any>attributes)
  }

  makeAs(className: string, name: string, attributes?: Object): any {
    return this.of(className, name).make(<any>attributes)
  }

  raw(className: string, attributes?: Object): any {
    return this.of(className).raw(<any>attributes)
  }

  rawOf(className: string, name: string, attributes?: Object): any {
    return this.of(className, name).raw(<any>attributes)
  }
}
register(FactoryManager)
