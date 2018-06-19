/// <reference path="../contracts/KnexProvider.ts" />

import * as Knex from 'knex'
import { NajsEloquent } from '../constants'
import { Facade } from 'najs-facade'
import { QueryBuilder, Config } from 'knex'
import { register } from 'najs-binding'

export class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<Knex, QueryBuilder, Config> {
  protected defaultConfig: Config

  getClassName() {
    return NajsEloquent.Provider.KnexProvider
  }

  setDefaultConfig(config: Config): this {
    this.defaultConfig = config

    return this
  }

  getDefaultConfig(): Config {
    return this.defaultConfig
  }

  create(config?: Config): Knex {
    return Knex(config || this.defaultConfig)
  }

  createQueryBuilder(table: string, config?: Config): QueryBuilder {
    return this.create(config)(table)
  }
}
register(KnexProvider, NajsEloquent.Provider.KnexProvider)
