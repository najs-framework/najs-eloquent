import { Operator } from '../../lib/interfaces/IBasicQueryGrammar'
import { set } from 'lodash'

export type SimpleCondition = {
  bool: 'and' | 'or'
  field: string
  operator: Operator
  value: any
}

export type GroupOfCondition = {
  bool: 'and' | 'or'
  queries: Condition[]
}

export type Condition = SimpleCondition | GroupOfCondition

export class MongodbConditionConverter {
  queryConditions: Object[]

  constructor(queryConditions: Object[]) {
    this.queryConditions = queryConditions
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
    this.convertConditionsWithBool(result, '$and', <any>conditions.filter(item => item['bool'] === 'and'))
    this.convertConditionsWithBool(result, '$or', <any>conditions.filter(item => item['bool'] === 'or'))
    if (Object.keys(result).length === 1 && typeof result['$and'] !== 'undefined') {
      return result['$and']
    }
    return result
  }

  protected convertConditionsWithBool(bucket: Object, bool: string, conditions: Condition[]) {
    const result: Object = {}
    for (const condition of conditions) {
      const query = this.convertCondition(condition)
      Object.assign(result, query)
    }

    const keysLength = Object.keys(result).length
    if (keysLength === 1) {
      Object.assign(bucket, result)
    }
    if (keysLength > 1) {
      Object.assign(bucket, { [bool]: result })
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

    const operator = condition.bool === 'and' ? '$and' : '$or'
    const result: Object = this.convertConditions(condition.queries)

    if (Object.keys(result).length === 0) {
      return {}
    }

    if (Object.keys(result).length === 1) {
      return result
    }
    return { [operator]: result }
  }

  protected convertSimpleCondition(condition: SimpleCondition): Object {
    if (typeof condition.value === 'undefined') {
      return {}
    }
    switch (condition.operator) {
      case '=':
      case '==':
        return set({}, condition.field, condition.value)
      case '!=':
      case '<>':
        return set({}, condition.field, { $not: condition.value })
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
    }
  }
}
