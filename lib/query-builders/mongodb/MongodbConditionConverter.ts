/// <reference path="../interfaces/IConditionQuery.ts" />

import { IAutoload, register } from 'najs-binding'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { set } from 'lodash'

export type SimpleCondition = {
  bool: 'and' | 'or'
  field: string
  operator: NajsEloquent.QueryBuilder.Operator
  value: any
}

export type GroupOfCondition = {
  bool: 'and' | 'or'
  queries: Condition[]
}

export type Condition = SimpleCondition | GroupOfCondition

export class MongodbConditionConverter implements IAutoload {
  static className: string = NajsEloquentClasses.QueryBuilder.MongodbConditionConverter
  queryConditions: Object[]

  constructor(queryConditions: Object[]) {
    this.queryConditions = queryConditions
  }

  getClassName() {
    return NajsEloquentClasses.QueryBuilder.MongodbConditionConverter
  }

  convert(): Object {
    return this.convertConditions(<any>this.queryConditions)
  }

  protected convertConditions(conditions: Condition[]) {
    const result = {}

    for (let i = 0, l = conditions.length; i < l; i++) {
      // fix edge case: `query.orWhere().where()...`
      if (i === 0 && conditions[i].bool === 'or') {
        conditions[i].bool = 'and'
      }

      // always change previous statement of OR bool to OR
      if (conditions[i].bool === 'or' && conditions[i - 1].bool === 'and') {
        conditions[i - 1].bool = 'or'
      }
    }
    this.convertConditionsWithAnd(result, <any>conditions.filter(item => item['bool'] === 'and'))
    this.convertConditionsWithOr(result, <any>conditions.filter(item => item['bool'] === 'or'))
    if (Object.keys(result).length === 1 && typeof result['$and'] !== 'undefined' && result['$and'].length === 1) {
      return result['$and'][0]
    }
    return result
  }

  protected hasAnyIntersectKey(a: Object, b: Object) {
    const keyOfA: string[] = Object.keys(a)
    const keyOfB: string[] = Object.keys(b)
    for (const key of keyOfB) {
      if (keyOfA.indexOf(key) !== -1) {
        return true
      }
    }
    return false
  }

  protected convertConditionsWithAnd(bucket: Object, conditions: Condition[]) {
    let result: Object | Object[] = {}
    for (const condition of conditions) {
      const query = this.convertCondition(condition)
      if (this.hasAnyIntersectKey(result, query) && !Array.isArray(result)) {
        result = [result]
      }

      if (Array.isArray(result)) {
        result.push(query)
        continue
      }
      Object.assign(result, query)
    }

    if (Array.isArray(result)) {
      Object.assign(bucket, { $and: result })
      return
    }

    const keysLength = Object.keys(result).length
    if (keysLength === 1) {
      Object.assign(bucket, result)
    }
    if (keysLength > 1) {
      Object.assign(bucket, { $and: [result] })
    }
  }

  protected convertConditionsWithOr(bucket: Object, conditions: Condition[]) {
    const result: Object[] = []
    for (const condition of conditions) {
      const query = this.convertCondition(condition)
      result.push(Object.assign({}, query))
    }

    if (result.length > 1) {
      Object.assign(bucket, { $or: result })
    }
  }

  protected convertCondition(condition: Condition): Object {
    if (typeof condition['queries'] === 'undefined') {
      return this.convertSimpleCondition(condition as SimpleCondition)
    }
    return this.convertGroupOfCondition(condition as GroupOfCondition)
  }

  protected convertGroupOfCondition(condition: GroupOfCondition): Object {
    if (!condition.queries || condition.queries.length === 0) {
      return {}
    }

    if (condition.queries.length === 1) {
      return this.convertCondition(<Condition>condition.queries[0])
    }
    return this.convertNotEmptyGroupOfCondition(condition)
  }

  private convertNotEmptyGroupOfCondition(condition: GroupOfCondition): Object {
    const result: Object = this.convertConditions(condition.queries)
    if (Object.keys(result).length === 0) {
      return {}
    }

    if (condition.bool === 'and') {
      if (Object.keys(result).length === 1) {
        return result
      }
      return { $and: [result] }
    }

    if (Object.keys(result).length === 1 && typeof result['$or'] !== 'undefined') {
      return result
    }
    return { $or: [result] }
  }

  protected convertSimpleCondition(condition: SimpleCondition): Object {
    if (typeof condition.value === 'undefined') {
      return {}
    }
    switch (condition.operator) {
      case '!=':
      case '<>':
        return set({}, condition.field, { $ne: condition.value })
      case '<':
        return set({}, condition.field, { $lt: condition.value })
      case '<=':
      case '=<':
        return set({}, condition.field, { $lte: condition.value })
      case '>':
        return set({}, condition.field, { $gt: condition.value })
      case '>=':
      case '=>':
        return set({}, condition.field, { $gte: condition.value })
      case 'in':
        return set({}, condition.field, { $in: condition.value })
      case 'not-in':
        return set({}, condition.field, { $nin: condition.value })

      case '=':
      case '==':
      default:
        return set({}, condition.field, condition.value)
    }
  }
}
register(MongodbConditionConverter)
