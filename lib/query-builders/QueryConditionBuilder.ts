import { IBasicQueryConditionGrammar, SubCondition, Operator } from '../interfaces/IBasicQueryGrammar'
import { isFunction } from 'lodash'

export class QueryCondition implements IBasicQueryConditionGrammar {
  isSubQuery: boolean
  bool: 'and' | 'or'
  operator: Operator
  field: string
  value: string
  queries: QueryCondition[]

  constructor() {
    this.isSubQuery = false
    this.queries = []
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

  private buildQuery(bool: 'and' | 'or', arg0: string | SubCondition, arg1: Operator | any, arg2: any): this {
    let queryCondition
    if (this.isSubQuery) {
      queryCondition = new QueryCondition()
      this.queries.push(queryCondition)
    } else {
      queryCondition = this
    }

    queryCondition.bool = bool

    if (isFunction(arg0)) {
      // case 1
      const query = new QueryCondition()
      query.isSubQuery = true
      arg0.call(undefined, query)
      for (const instance of query.queries) {
        queryCondition.queries.push(instance)
      }
      query.isSubQuery = false
      return this
    }

    queryCondition.field = <string>arg0
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

  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: Operator, value: any): this
  where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    return this.buildQuery('and', arg0, arg1, arg2)
  }

  orWhere(conditionBuilder: SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: Operator, value: any): this
  orWhere(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    return this.buildQuery('or', arg0, arg1, arg2)
  }

  whereIn(field: string, values: Array<any>): this {
    return this.buildQuery('and', field, 'in', values)
  }

  whereNotIn(field: string, values: Array<any>): this {
    return this.buildQuery('and', field, 'not-in', values)
  }

  orWhereIn(field: string, values: Array<any>): this {
    return this.buildQuery('or', field, 'in', values)
  }

  orWhereNotIn(field: string, values: Array<any>): this {
    return this.buildQuery('or', field, 'not-in', values)
  }
}
