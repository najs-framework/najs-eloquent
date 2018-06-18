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
  protected knex: Knex.QueryBuilder

  constructor(table: string, primaryKeyName: string, softDelete?: { deletedAt: string }) {
    super()
    this.table = table
    this.primaryKeyName = primaryKeyName
    this.softDelete = softDelete
    this.knex = KnexProvider.create(table)
  }

  orderBy(field: string, direction?: string): this {
    this.isUsed = true
    this.knex.orderBy(field, direction)
    return this
  }
}

// getPrimaryKeyName orderByAsc orderByDesc
// withTrashed onlyTrashed
const methods = [
  // NajsEloquent.QueryBuilder.IBasicQuery
  'select',
  'limit'
].concat(QueryFunctions.ConditionQuery)

// implicit forwards method to knex
for (const name of methods) {
  KnexQueryBuilder.prototype[name] = function() {
    this['isUsed'] = true
    this['knex'][name](...arguments)
    return this
  }
}
