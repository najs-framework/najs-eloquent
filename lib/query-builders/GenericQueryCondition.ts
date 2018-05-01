/// <reference path="interfaces/IQueryConvention.ts" />
/// <reference path="interfaces/IConditionQuery.ts" />

import { isFunction } from 'lodash'
import { GenericQueryConditionHelpers } from './GenericQueryConditionHelpers'

export interface GenericQueryCondition extends NajsEloquent.QueryBuilder.IConditionQuery {}
export class GenericQueryCondition implements NajsEloquent.QueryBuilder.IConditionQuery {
  convention: NajsEloquent.QueryBuilder.IQueryConvention
  isSubQuery: boolean
  bool: 'and' | 'or'
  operator: NajsEloquent.QueryBuilder.Operator
  field: string
  value: string
  queries: GenericQueryCondition[]

  protected constructor() {
    this.isSubQuery = false
    this.queries = []
  }

  static create(
    convention: NajsEloquent.QueryBuilder.IQueryConvention,
    operator: 'and' | 'or',
    arg0: string | NajsEloquent.QueryBuilder.SubCondition,
    arg1: NajsEloquent.QueryBuilder.Operator | any,
    arg2: any
  ): GenericQueryCondition {
    const condition = new GenericQueryCondition()
    condition.convention = convention
    condition.buildQuery(operator, arg0, arg1, arg2)
    return condition
  }

  toObject(): Object {
    const result: Object = {
      bool: this.bool
    }
    if (this.queries.length > 0) {
      result['queries'] = []
      for (const subQuery of this.queries) {
        result['queries'].push(subQuery.toObject())
      }
    } else {
      result['operator'] = this.operator
      result['field'] = this.field
      result['value'] = this.value
    }
    return result
  }

  protected buildQuery(
    bool: 'and' | 'or',
    arg0: string | NajsEloquent.QueryBuilder.SubCondition,
    arg1: NajsEloquent.QueryBuilder.Operator | any,
    arg2: any
  ): this {
    let queryCondition
    if (this.isSubQuery) {
      queryCondition = new GenericQueryCondition()
      this.queries.push(queryCondition)
    } else {
      queryCondition = this
    }

    queryCondition.bool = bool
    if (isFunction(arg0)) {
      return this.buildSubQuery(queryCondition, arg0)
    }

    queryCondition.field = this.convention.formatFieldName(arg0)
    if (typeof arg2 === 'undefined') {
      // case 2
      queryCondition.operator = '='
      queryCondition.value = arg1
    } else {
      // case 3
      queryCondition.operator = arg1
      queryCondition.value = arg2
    }
    return this
  }

  protected buildSubQuery(queryCondition: GenericQueryCondition, arg0: Function) {
    // case 1
    const query = new GenericQueryCondition()
    query.convention = this.convention
    query.isSubQuery = true
    arg0.call(undefined, query)
    for (const instance of query.queries) {
      queryCondition.queries.push(instance)
    }
    query.isSubQuery = false
    return this
  }

  where(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): this
  where(arg0: any, arg1?: any, arg2?: any): this {
    return this.buildQuery('and', arg0, arg1, arg2)
  }

  orWhere(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): this
  orWhere(arg0: any, arg1?: any, arg2?: any): this {
    return this.buildQuery('or', arg0, arg1, arg2)
  }
}

// implicit implements the other .where... condition
for (const fn of GenericQueryConditionHelpers.FUNCTIONS) {
  GenericQueryCondition.prototype[fn] = GenericQueryConditionHelpers.prototype[fn]
}
