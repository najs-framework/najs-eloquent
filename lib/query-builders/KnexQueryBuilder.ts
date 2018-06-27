/// <reference path="interfaces/ISoftDeleteQuery.ts" />

import './KnexQueryLog'
import * as Knex from 'knex'
import { KnexProvider } from './../facades/global/KnexProviderFacade'
import { QueryFunctions } from '../constants'
import { QueryBuilderBase } from './QueryBuilderBase'
import { KnexQueryLog } from './KnexQueryLog'
import { NajsEloquent } from '../constants'
import { make, register } from 'najs-binding'

export interface KnexQueryBuilder<T>
  extends NajsEloquent.QueryBuilder.IBasicQuery,
    NajsEloquent.QueryBuilder.ISoftDeleteQuery,
    NajsEloquent.QueryBuilder.IConditionQuery {}

export class KnexQueryBuilder<T> extends QueryBuilderBase
  implements Najs.Contracts.Autoload, NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
  protected softDelete?: { deletedAt: string }
  protected table: string
  protected configName?: string
  protected knexQueryBuilder: Knex.QueryBuilder | null
  protected addSoftDeleteCondition: boolean
  protected addedSoftDeleteCondition: boolean

  constructor(table: string, primaryKeyName: string, configName?: string, softDelete?: { deletedAt: string }) {
    super()
    this.table = table
    this.primaryKeyName = primaryKeyName
    this.configName = configName
    this.softDelete = softDelete
    this.addSoftDeleteCondition = !!softDelete ? true : false
    this.addedSoftDeleteCondition = false
  }

  getClassName() {
    return NajsEloquent.QueryBuilder.KnexQueryBuilder
  }

  getKnexQueryBuilder() {
    if (!this.knexQueryBuilder) {
      this.knexQueryBuilder = KnexProvider.createQueryBuilder(this.table, <any>this.configName)
    }
    if (this.softDelete && this.addSoftDeleteCondition && !this.addedSoftDeleteCondition) {
      this.knexQueryBuilder.whereNull(this.softDelete.deletedAt)
      this.addedSoftDeleteCondition = true
    }
    return this.knexQueryBuilder
  }

  orderBy(field: string, direction?: string): this {
    this.isUsed = true
    this.getKnexQueryBuilder().orderBy(field, direction)
    return this
  }

  withTrashed() {
    if (this.softDelete) {
      this.addSoftDeleteCondition = false
      this.isUsed = true
    }

    return this
  }

  onlyTrashed() {
    if (this.softDelete) {
      this.addSoftDeleteCondition = false
      this.whereNotNull(this.softDelete.deletedAt)
      this.isUsed = true
    }

    return this
  }

  // -------------------------------------------------------------------------------------------------------------------

  get(): Promise<T[]> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  first(): Promise<T | null> {
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

  update(data: Object): Promise<number> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      queryBuilder.update(data)
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  delete(): Promise<number> {
    return new Promise(resolve => {
      const queryBuilder = this.getKnexQueryBuilder()
      queryBuilder.delete()
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  restore(): Promise<number> {
    return new Promise(resolve => {
      if (!this.softDelete) {
        resolve(0)
      }

      const queryBuilder = this.getKnexQueryBuilder()
      const data = { [this.softDelete!.deletedAt]: this.convention.getNullValueFor(this.softDelete!.deletedAt) }
      queryBuilder.update(data)
      this.resolveKnexQueryLog().log(this)
      queryBuilder.then(resolve)
    })
  }

  execute(): Promise<any> {
    return new Promise(resolve => {
      return this.getKnexQueryBuilder().then(resolve)
    })
  }

  native(handler: (queryBuilder: Knex.QueryBuilder) => void): this {
    handler(this.getKnexQueryBuilder())

    return this
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
  KnexQueryBuilder.prototype[name] = function(this: KnexQueryBuilder<any>) {
    this['isUsed'] = true
    this.getKnexQueryBuilder()[name](...arguments)
    return this
  }
}
register(KnexQueryBuilder, NajsEloquent.QueryBuilder.KnexQueryBuilder)
