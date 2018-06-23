/// <reference path="../contracts/KnexProvider.ts" />

import * as Knex from 'knex'
import { NajsEloquent } from '../constants'
import { Facade } from 'najs-facade'
import { QueryBuilder, Config } from 'knex'
import { register } from 'najs-binding'

export class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<Knex, QueryBuilder, Config> {
  protected defaultConfig: Config
  protected defaultKnex?: Knex

  getClassName() {
    return NajsEloquent.Provider.KnexProvider
  }

  setDefaultConfig(config: Config): this {
    this.defaultConfig = config
    this.defaultKnex = undefined

    return this
  }

  getDefaultConfig(): Config {
    return this.defaultConfig
  }

  create(config?: Config): Knex {
    if (!config) {
      if (!this.defaultKnex) {
        this.defaultKnex = Knex(this.defaultConfig)
      }
      return this.defaultKnex
    }
    return Knex(config!)
  }

  createQueryBuilder(table: string, config?: Config): QueryBuilder {
    return this.create(config).table(table)
  }
}
register(KnexProvider, NajsEloquent.Provider.KnexProvider)
