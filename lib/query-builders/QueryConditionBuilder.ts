import { SubCondition, Operator } from './../interfaces/IBasicQueryGrammar'
import { isFunction } from 'lodash'

export class QueryCondition {
  bool: 'and' | 'or' | 'root'
  operator: Operator
  field: string
  value: string
  queries: QueryCondition[]

  constructor() {
    this.queries = []
  }

  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: Operator, value: any): this
  where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    this.bool = 'and'
    if (isFunction(arg0)) {
      // case 1
      const subQuery = new QueryCondition()
      this.queries.push(subQuery)
      arg0.call(subQuery)
      return this
    }

    this.field = <string>arg0
    if (typeof arg2 === 'undefined') {
      // case 2
      this.operator = '='
      this.value = arg1
    } else {
      // case 3
      this.operator = arg1
      this.value = arg2
    }
    return this
  }
}
