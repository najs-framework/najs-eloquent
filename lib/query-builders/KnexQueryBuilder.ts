/// <reference path="interfaces/ISoftDeleteQuery.ts" />

import * as Knex from 'knex'

export class KnexQueryBuilder {
  protected softDelete?: { deletedAt: string }
  protected knex: Knex.Config

  constructor(softDelete?: { deletedAt: string }) {
    this.softDelete = softDelete
  }

  select(...fields: Array<string | string[]>): this
  select(): any {
    // Knex({})('test').from()
    // const instance = Knex({})
    // instance.select(instance.raw(''))
  }
}
