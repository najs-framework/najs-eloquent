/// <reference path="../../definitions/query-builders/IConvention.ts" />
/// <reference path="../../definitions/query-grammars/IBasicQuery.ts" />
/// <reference path="../../definitions/query-grammars/IBasicConditionQuery.ts" />
import IConvention = NajsEloquent.QueryBuilder.IConvention
import IBasicQuery = NajsEloquent.QueryGrammar.IBasicQuery
import IBasicConditionQuery = NajsEloquent.QueryGrammar.IBasicConditionQuery
import SubCondition = NajsEloquent.QueryGrammar.SubCondition
import OperatorType = NajsEloquent.QueryGrammar.Operator

import { QueryCondition } from './QueryCondition'
import { flatten } from 'lodash'
import { array_unique } from '../../util/functions'
import { Operator } from './Operator'

export type QueryBuilderSoftDelete = {
  deletedAt: string
}

export class BasicQuery implements IBasicQuery, IBasicConditionQuery {
  protected fields: {
    select?: string[]
    distinct?: string[]
  }
  protected ordering: Map<string, string>
  protected limitNumber: number
  protected conditions: QueryCondition[]
  protected convention: IConvention

  constructor(convention: IConvention) {
    this.fields = {}
    this.ordering = new Map()
    this.conditions = []
    this.convention = convention
  }

  getConditions() {
    return this.conditions.map(item => item.toObject())
  }

  getRawConditions() {
    return this.conditions
  }

  getLimit(): number {
    return this.limitNumber
  }

  getOrdering(): Map<string, string> {
    return this.ordering
  }

  getSelect() {
    return this.fields.select
  }

  clearSelect() {
    delete this.fields.select
  }

  clearOrdering() {
    this.ordering.clear()
  }

  select(...fields: Array<string | string[]>): this {
    const names = array_unique(flatten(fields)).map(this.convention.formatFieldName)
    if (typeof this.fields.select === 'undefined') {
      this.fields.select = names
    } else {
      this.fields.select = array_unique(this.fields.select.concat(names))
    }

    return this
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.ordering.set(this.convention.formatFieldName(field), direction)
    return this
  }

  limit(records: number): this {
    this.limitNumber = records
    return this
  }

  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: OperatorType, value: any): this
  where(arg0: any, arg1?: any, arg2?: any): this {
    this.conditions.push(QueryCondition.create(this.convention, Operator.And, arg0, arg1, arg2))

    return this
  }

  orWhere(conditionBuilder: SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: OperatorType, value: any): this
  orWhere(arg0: any, arg1?: any, arg2?: any): this {
    this.conditions.push(QueryCondition.create(this.convention, Operator.Or, arg0, arg1, arg2))

    return this
  }
}
