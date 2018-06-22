/// <reference path="interfaces/ISoftDeleteQuery.ts" />

import './KnexQueryLog'
import * as Knex from 'knex'
import { KnexProvider } from './../facades/global/KnexProviderFacade'
import { QueryFunctions } from '../constants'
import { QueryBuilderBase } from './QueryBuilderBase'
import { KnexQueryLog } from './KnexQueryLog'
import { NajsEloquent } from '../constants'
import { make, register } from 'najs-binding'

export interface KnexQueryBuilder
  extends NajsEloquent.QueryBuilder.IBasicQuery,
    NajsEloquent.QueryBuilder.ISoftDeleteQuery,
    NajsEloquent.QueryBuilder.IConditionQuery {}

export class KnexQueryBuilder extends QueryBuilderBase implements Najs.Contracts.Autoload {
  protected softDelete?: { deletedAt: string }
  protected table: string
  protected knexQueryBuilder: Knex.QueryBuilder | null

  constructor(table: string, primaryKeyName: string, softDelete?: { deletedAt: string }) {
    super()
    this.table = table
    this.primaryKeyName = primaryKeyName
    this.softDelete = softDelete
  }

  getClassName() {
    return NajsEloquent.QueryBuilder.KnexQueryBuilder
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
      const queryBuilder = this.getKnexQueryBuilder()
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  first(): Promise<object | null> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      queryBuilder.first()
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(function(result) {
        if (result) {
          return resolve(result)
        }

        // tslint:disable-next-line
        return resolve(null)
      })
    })
  }

  count(): Promise<number> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      queryBuilder.clearSelect().count()
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(function(result) {
        const keys = Object.keys(result[0])
        resolve(result[0][keys[0]])
      })
    })
  }

  update(data: Object): Promise<object> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      queryBuilder.update(data)
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  delete(): Promise<object> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      queryBuilder.delete()
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  resolveKnexQueryLog(): KnexQueryLog {
    return make(NajsEloquent.QueryBuilder.KnexQueryLog, [])
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
register(KnexQueryBuilder, NajsEloquent.QueryBuilder.KnexQueryBuilder)
