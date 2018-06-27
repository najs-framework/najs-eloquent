/// <reference path="../contracts/KnexProvider.ts" />

import * as Knex from 'knex'
import { NajsEloquent } from '../constants'
import { Facade } from 'najs-facade'
import { QueryBuilder, Config } from 'knex'
import { register } from 'najs-binding'

export class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<Knex, QueryBuilder, Config> {
  protected configurations: {
    [name: string]: Config
  }
  protected instances: {
    [name: string]: Knex | undefined
  }

  constructor() {
    super()
    this.configurations = {}
    this.instances = {}
  }

  getClassName() {
    return NajsEloquent.Provider.KnexProvider
  }

  setConfig(name: string, config: Config): this {
    this.configurations[name] = config
    this.instances[name] = undefined

    return this
  }

  getConfig(name: string): Config {
    return this.configurations[name]
  }

  setDefaultConfig(config: Config): this {
    return this.setConfig('default', config)
  }

  getDefaultConfig(): Config {
    return this.getConfig('default')
  }

  create(arg1?: string | Config, arg2?: Config): Knex {
    if (typeof arg1 === 'object') {
      return Knex(<object>arg1)
    }

    if (typeof arg1 === 'undefined') {
      arg1 = 'default'
    }

    if (typeof arg2 !== 'undefined') {
      this.setConfig(arg1, arg2)
    }

    if (!this.instances[arg1]) {
      this.instances[arg1] = Knex(this.configurations[arg1])
    }
    return this.instances[arg1]!
  }

  createQueryBuilder(table: string, arg1?: Config | string, arg2?: Config): QueryBuilder {
    return this.create(<any>arg1, <any>arg2).table(table)
  }
}
register(KnexProvider, NajsEloquent.Provider.KnexProvider)
