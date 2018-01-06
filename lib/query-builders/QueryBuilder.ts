import { QueryCondition } from './QueryConditionBuilder'
import { OrderDirection, SubCondition } from '../interfaces/IBasicQueryGrammar'
import { isString } from 'lodash'

export class QueryBuilder<T> {
  selectedFields: string[]
  distinctFields: string[]
  ordering: Object
  limitNumber: number
  conditions: QueryCondition[]

  constructor() {
    this.selectedFields = []
    this.distinctFields = []
    this.ordering = {}
    this.conditions = []
  }

  protected _flatten_and_assign_to(name: string, fields: Array<string | string[]>) {
    let result: string[] = []
    for (let i = 0, l = fields.length; i < l; i++) {
      if (isString(fields[i])) {
        result.push(<string>fields[i])
        continue
      }

      result = result.concat(<string[]>fields[i])
    }
    this[name] = Array.from(new Set(result))
    return this
  }

  protected getConditions(): Object[] {
    return this.conditions.map(item => item.toObject())
  }

  select(field: string): this
  select(fields: string[]): this
  select(...fields: Array<string | string[]>): this
  select(...fields: Array<string | string[]>): this {
    return this._flatten_and_assign_to('selectedFields', fields)
  }

  distinct(field: string): this
  distinct(fields: string[]): this
  distinct(...fields: Array<string | string[]>): this
  distinct(...fields: Array<string | string[]>): this {
    return this._flatten_and_assign_to('distinctFields', fields)
  }

  orderBy(field: string): this
  orderBy(field: string, direction: OrderDirection): this
  orderBy(field: string, direction: OrderDirection = 'asc'): this {
    this.ordering[field] = direction
    return this
  }

  orderByAsc(field: string): this {
    this.ordering[field] = 'asc'
    return this
  }

  orderByDesc(field: string): this {
    this.ordering[field] = 'desc'
    return this
  }

  limit(records: number): this {
    this.limitNumber = records
    return this
  }

  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: Operator, value: any): this
  where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    const condition = new QueryCondition()
    condition.where(<any>arg0, arg1, arg2)
    this.conditions.push(condition)
    return this
  }

  orWhere(conditionBuilder: SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: Operator, value: any): this
  orWhere(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    const condition = new QueryCondition()
    condition.orWhere(<any>arg0, arg1, arg2)
    this.conditions.push(condition)
    return this
  }
}
