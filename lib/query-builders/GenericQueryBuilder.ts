/// <reference path="interfaces/IBasicQuery.ts" />
/// <reference path="interfaces/IConditionQuery.ts" />
/// <reference path="interfaces/ISoftDeleteQuery.ts" />
/// <reference path="interfaces/IQueryConvention.ts" />

import { GenericQueryCondition } from './GenericQueryCondition'
import { GenericQueryConditionHelpers } from './GenericQueryConditionHelpers'
import { flatten } from 'lodash'
import { array_unique } from '../util/functions'

export type QueryBuilderSoftDelete = {
  deletedAt: string
}

export interface GenericQueryBuilder extends NajsEloquent.QueryBuilder.IConditionQuery {}
export class GenericQueryBuilder
  implements NajsEloquent.QueryBuilder.IBasicQuery, NajsEloquent.QueryBuilder.ISoftDeleteQuery {
  protected isUsed: boolean
  protected name: string
  protected fields: {
    select?: string[]
    distinct?: string[]
  }
  protected selectedFields: string[]
  protected distinctFields: string[]
  protected ordering: Object
  protected limitNumber: number
  protected conditions: GenericQueryCondition[]
  protected convention: NajsEloquent.QueryBuilder.IQueryConvention
  protected softDelete?: QueryBuilderSoftDelete
  protected addSoftDeleteCondition: boolean
  protected logGroup: string

  constructor(softDelete?: QueryBuilderSoftDelete) {
    this.fields = {}
    this.ordering = {}
    this.conditions = []
    this.convention = this.getQueryConvention()
    this.softDelete = softDelete
    this.isUsed = false
    this.addSoftDeleteCondition = !!softDelete ? true : false
  }

  protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention {
    return {
      formatFieldName(name: any) {
        return name
      },
      getNullValueFor(name: any) {
        // tslint:disable-next-line
        return null
      }
    }
  }

  protected getConditions(): Object[] {
    if (this.softDelete && this.addSoftDeleteCondition) {
      this.whereNull(this.softDelete.deletedAt)
    }
    return this.conditions.map(item => item.toObject())
  }

  protected flattenFieldNames(type: string, fields: ArrayLike<any>) {
    this.isUsed = true
    this.fields[type] = array_unique(flatten(fields)).map(this.convention.formatFieldName)
    return this
  }

  queryName(name: string): this {
    this.name = name
    return this
  }

  getPrimaryKeyName(): string {
    return this.convention.formatFieldName('id')
  }

  setLogGroup(group: string): this {
    this.logGroup = group
    return this
  }

  select(field: string): this
  select(fields: string[]): this
  select(...fields: Array<string | string[]>): this
  select(): this {
    return this.flattenFieldNames('select', arguments)
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.isUsed = true
    this.ordering[this.convention.formatFieldName(field)] = direction
    return this
  }

  orderByAsc(field: string): this {
    return this.orderBy(field, 'asc')
  }

  orderByDesc(field: string): this {
    return this.orderBy(field, 'desc')
  }

  limit(records: number): this {
    this.isUsed = true
    this.limitNumber = records
    return this
  }

  protected createConditionQuery(
    operator: 'and' | 'or',
    arg0: string | NajsEloquent.QueryBuilder.SubCondition,
    arg1?: NajsEloquent.QueryBuilder.Operator | any,
    arg2?: any
  ): this {
    this.isUsed = true
    this.conditions.push(GenericQueryCondition.create(this.convention, operator, arg0, arg1, arg2))
    return this
  }

  where(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): this
  where(arg0: any, arg1?: any, arg2?: any): this {
    return this.createConditionQuery('and', arg0, arg1, arg2)
  }

  orWhere(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): this
  orWhere(arg0: any, arg1?: any, arg2?: any): this {
    return this.createConditionQuery('or', arg0, arg1, arg2)
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
}

// implicit implements the other .where... condition
for (const fn of GenericQueryConditionHelpers.FUNCTIONS) {
  GenericQueryBuilder.prototype[fn] = GenericQueryConditionHelpers.prototype[fn]
}
