import { QueryCondition } from './QueryConditionBuilder'
import { OrderDirection, SubCondition, Operator } from '../interfaces/IBasicQueryGrammar'
import { isString } from 'lodash'

export type QueryBuilderSoftDelete = {
  deletedAt: string
}

export class QueryBuilder {
  protected name: string
  protected selectedFields: string[]
  protected distinctFields: string[]
  protected ordering: Object
  protected limitNumber: number
  protected conditions: QueryCondition[]
  protected isUsed: boolean
  protected softDelete?: QueryBuilderSoftDelete
  protected addSoftDeleteCondition: boolean

  constructor(softDelete?: QueryBuilderSoftDelete) {
    this.selectedFields = []
    this.distinctFields = []
    this.ordering = {}
    this.conditions = []
    this.softDelete = softDelete
    this.isUsed = false
    this.addSoftDeleteCondition = softDelete ? true : false
  }

  protected getFieldByName(name: any) {
    return name
  }

  protected getNullValue(name: any) {
    // tslint:disable-next-line
    return null
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
    this[name] = Array.from(new Set(result)).map(this.getFieldByName)
    return this
  }

  protected getConditions(): Object[] {
    if (this.softDelete && this.addSoftDeleteCondition) {
      this.whereNull(this.softDelete.deletedAt)
    }
    return this.conditions.map(item => item.toObject())
  }

  queryName(name: string): this {
    this.name = name
    return this
  }

  select(field: string): this
  select(fields: string[]): this
  select(...fields: Array<string | string[]>): this
  select(...fields: Array<string | string[]>): this {
    this.isUsed = true
    return this._flatten_and_assign_to('selectedFields', fields)
  }

  distinct(field: string): this
  distinct(fields: string[]): this
  distinct(...fields: Array<string | string[]>): this
  distinct(...fields: Array<string | string[]>): this {
    this.isUsed = true
    return this._flatten_and_assign_to('distinctFields', fields)
  }

  orderBy(field: string): this
  orderBy(field: string, direction: OrderDirection): this
  orderBy(field: string, direction: OrderDirection = 'asc'): this {
    this.isUsed = true
    this.ordering[this.getFieldByName(field)] = direction
    return this
  }

  orderByAsc(field: string): this {
    this.isUsed = true
    this.ordering[this.getFieldByName(field)] = 'asc'
    return this
  }

  orderByDesc(field: string): this {
    this.isUsed = true
    this.ordering[this.getFieldByName(field)] = 'desc'
    return this
  }

  limit(records: number): this {
    this.isUsed = true
    this.limitNumber = records
    return this
  }

  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: Operator, value: any): this
  where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    this.isUsed = true
    const condition = new QueryCondition()
    condition.where(<any>this.getFieldByName(arg0), arg1, arg2)
    this.conditions.push(condition)
    return this
  }

  orWhere(conditionBuilder: SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: Operator, value: any): this
  orWhere(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this {
    this.isUsed = true
    const condition = new QueryCondition()
    condition.orWhere(<any>this.getFieldByName(arg0), arg1, arg2)
    this.conditions.push(condition)
    return this
  }

  whereIn(field: string, values: Array<any>): this {
    return this.where(field, 'in', values)
  }

  whereNotIn(field: string, values: Array<any>): this {
    return this.where(field, 'not-in', values)
  }

  orWhereIn(field: string, values: Array<any>): this {
    return this.orWhere(field, 'in', values)
  }

  orWhereNotIn(field: string, values: Array<any>): this {
    return this.orWhere(field, 'not-in', values)
  }

  whereNull(field: string) {
    return this.where(field, this.getNullValue(field))
  }

  whereNotNull(field: string) {
    return this.where(field, '<>', this.getNullValue(field))
  }

  orWhereNull(field: string) {
    return this.orWhere(field, this.getNullValue(field))
  }

  orWhereNotNull(field: string) {
    return this.orWhere(field, '<>', this.getNullValue(field))
  }

  withTrash() {
    if (this.softDelete) {
      this.addSoftDeleteCondition = false
      this.isUsed = true
    }
    return this
  }

  onlyTrash() {
    if (this.softDelete) {
      this.addSoftDeleteCondition = false
      this.whereNotNull(this.softDelete.deletedAt)
      this.isUsed = true
    }
    return this
  }
}
