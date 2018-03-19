import { IQueryConvention } from './interfaces/IQueryConvention'
import { IConditionQuery, SubCondition, Operator } from './interfaces/IConditionQuery'
import { isFunction } from 'lodash'

export class GenericQueryCondition implements IConditionQuery {
  convention: IQueryConvention
  isSubQuery: boolean
  bool: 'and' | 'or'
  operator: Operator
  field: string
  value: string
  queries: GenericQueryCondition[]

  protected constructor() {
    this.isSubQuery = false
    this.queries = []
  }

  static create(
    convention: IQueryConvention,
    operator: 'and' | 'or',
    arg0: string | SubCondition,
    arg1: Operator | any,
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

  protected buildQuery(bool: 'and' | 'or', arg0: string | SubCondition, arg1: Operator | any, arg2: any): this {
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

  where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    return this.buildQuery('and', arg0, arg1, arg2)
  }

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

  whereNull(field: string) {
    return this.buildQuery('and', field, '=', this.convention.getNullValueFor(field))
  }

  whereNotNull(field: string) {
    return this.buildQuery('and', field, '<>', this.convention.getNullValueFor(field))
  }

  orWhereNull(field: string) {
    return this.buildQuery('or', field, '=', this.convention.getNullValueFor(field))
  }

  orWhereNotNull(field: string) {
    return this.buildQuery('or', field, '<>', this.convention.getNullValueFor(field))
  }
}
