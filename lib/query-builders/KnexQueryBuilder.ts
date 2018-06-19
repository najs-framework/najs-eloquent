/// <reference path="interfaces/ISoftDeleteQuery.ts" />

import * as Knex from 'knex'
import { KnexProvider } from './../facades/global/KnexProviderFacade'
import { QueryFunctions } from '../constants'
import { QueryBuilderBase } from './QueryBuilderBase'

export interface KnexQueryBuilder
  extends NajsEloquent.QueryBuilder.IBasicQuery,
    NajsEloquent.QueryBuilder.ISoftDeleteQuery,
    NajsEloquent.QueryBuilder.IConditionQuery {}

export class KnexQueryBuilder extends QueryBuilderBase {
  protected softDelete?: { deletedAt: string }
  protected table: string
  protected knexQueryBuilder: Knex.QueryBuilder | null

  constructor(table: string, primaryKeyName: string, softDelete?: { deletedAt: string }) {
    super()
    this.table = table
    this.primaryKeyName = primaryKeyName
    this.softDelete = softDelete
  }

  getKnexQueryBuilder() {
    if (!this.knexQueryBuilder) {
      this.knexQueryBuilder = KnexProvider.createQueryBuilder(this.table)
    }
    return this.knexQueryBuilder
  }

  orderBy(field: string, direction?: string): this {
    this.isUsed = true
    this.getKnexQueryBuilder().orderBy(field, direction)
    return this
  }

  // withTrashed() {
  //   return this
  // }

  // onlyTrashed() {
  //   return this
  // }

  // -------------------------------------------------------------------------------------------------------------------

  get(): Promise<object[]> {
    return new Promise(resolve => {
      // const query = this.knexQueryBuilder.toQuery()
      // console.log(query)
      this.getKnexQueryBuilder().then(resolve)
    })
  }
}

const methods = [
  // NajsEloquent.QueryBuilder.IBasicQuery
  'select',
  'limit'
].concat(QueryFunctions.ConditionQuery)

// implicit forwards method to knex
for (const name of methods) {
  KnexQueryBuilder.prototype[name] = function(this: KnexQueryBuilder) {
    this['isUsed'] = true
    this.getKnexQueryBuilder()[name](...arguments)
    return this
  }
}
