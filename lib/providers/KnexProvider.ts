/// <reference path="../contracts/KnexProvider.ts" />

import * as Knex from 'knex'
import { NajsEloquent } from '../constants'
import { Facade } from 'najs-facade'
import { QueryBuilder, Config } from 'knex'
import { register } from 'najs-binding'

export class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<Knex, QueryBuilder, Config> {
  protected config: Config

  getClassName() {
    return NajsEloquent.Provider.KnexProvider
  }

  setDefaultConfig(config: Config): this {
    this.config = config

    return this
  }

  getDefaultConfig(): Config {
    return this.config
  }

  createKnex(config?: Config): Knex {
    return Knex(config || this.config)
  }

  createQueryBuilder(table: string, config?: Config): QueryBuilder {
    return this.createKnex(config)(table)
  }
}
register(KnexProvider, NajsEloquent.Provider.KnexProvider)
